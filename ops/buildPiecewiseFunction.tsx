const nerdamer = require('nerdamer');
import 'nerdamer/Calculus';
import 'nerdamer/Solve';

type ExprRange = [string, [number, number]];
export type PiecewiseFunction = ExprRange[];

interface PieceSpec {
  expr: string;
  len: number;
  area: [number | null, number | null];
}

export function solveToArray(equation: string, variable: string): string[] {
  try {
    const solutions = nerdamer.solve(equation, variable);
    if (solutions && typeof solutions.text === 'function') {
      const str = solutions.text();
      return str
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((s: string) => s.trim());
    }
    return [];
  } catch {
    return [];
  }
}

export function toNumber(val: any): number {
  if (typeof val === 'object' && val && typeof val.evaluate === 'function') {
    return val.evaluate().valueOf();
  }
  if (typeof val === 'string') {
    const n = Number(val);
    if (!isNaN(n)) return n;
  }
  return val;
}

export function buildPiecewiseFunction(
  [xStart, xEnd]: [number, number],
  yMinTarget: number | null = null,
  ...pieces: PieceSpec[]
): PiecewiseFunction {
  const totalLen = xEnd - xStart;
  let currentX = xStart;
  const piecewise: PiecewiseFunction = [];

  let prevEndValue: number | null = null;

  for (const { expr, len, area } of pieces) {
    let [areaStart, areaEnd] = area;

    const derivative = nerdamer(`diff(${expr}, x)`);
    const derivativeStr = derivative.toString();
    let roots: number[] = [];

    if (areaStart === null || areaEnd === null) {
      const isConstant = derivative.symbol?.isConstant?.();
      if (!isConstant) {
        try {
          roots = solveToArray(`${derivativeStr} = 0`, 'x')
            .map(r => nerdamer(r).evaluate().valueOf())
            .filter(n => typeof n === 'number' && !isNaN(n));
        } catch {
          roots = [];
        }
      }
      if (roots.length === 0) roots = [0, 1];
      if (areaStart === null && areaEnd === null) {
        areaStart = roots[0];
        areaEnd = roots[1] ?? roots[0];
      } else if (areaStart === null) {
        areaStart = roots[0];
      } else if (areaEnd === null) {
        areaEnd = roots[0];
      }
    }

    areaStart = toNumber(areaStart);
    areaEnd = toNumber(areaEnd);

    if (areaStart == null || isNaN(areaStart)) areaStart = 0;
    if (areaEnd == null || isNaN(areaEnd)) areaEnd = 1;
    if (areaEnd === areaStart) areaEnd = areaStart + 1;

    const segLen = totalLen * len;
    const segStart = currentX;
    const segEnd = segStart + segLen;

    const scale = (areaEnd - areaStart) / (segEnd - segStart);
    const xMapped = `(${scale})*(x - ${segStart}) + ${areaStart}`;
    const transformedExpr = expr.replace(/\bx\b/g, `(${xMapped})`);

    const currStartValue = Number(nerdamer(expr).evaluate({ x: areaStart }).text());

    let offset = 0;
    if (prevEndValue !== null) {
      offset = prevEndValue - currStartValue;
    }

    const offsetExpr = `(${transformedExpr}) + (${offset})`;
    piecewise.push([offsetExpr, [segStart, segEnd]]);
    prevEndValue = Number(nerdamer(offsetExpr).evaluate({ x: segEnd }).text());

    currentX = segEnd;
  }

  if (yMinTarget !== null) {
    let minValue = Infinity;

    for (const [expr, [a, b]] of piecewise) {
      try {
        const df = nerdamer(`diff(${expr}, x)`);
        const criticals = solveToArray(`${df.toString()} = 0`, 'x')
          .map(s => Number(nerdamer(s).evaluate().text()))
          .filter(n => n >= a && n <= b);

        const pointsToCheck = [a, b, ...criticals];
        for (const x of pointsToCheck) {
          const val = Number(nerdamer(expr).evaluate({ x }).text());
          if (!isNaN(val) && val < minValue) minValue = val;
        }
      } catch {}
    }

    const shift = yMinTarget - minValue;
    for (let i = 0; i < piecewise.length; i++) {
      const [expr, range] = piecewise[i];
      piecewise[i] = [`(${expr}) + (${shift})`, range];
    }
  }

  return piecewise;
}

export function integratePiecewise(
  [rangeStart, rangeEnd]: [number, number],
  piecewise: PiecewiseFunction
): PiecewiseFunction {
  const integrals: PiecewiseFunction = [];
  let prevEndValue = 0;

  for (const [expr, [a, b]] of piecewise) {
    const F = nerdamer(`integrate(${expr}, x)`).toString();
    const Fa = nerdamer(F).evaluate({ x: a }).valueOf();
    const C = prevEndValue - Fa;
    const fullExpr = `(${F}) + (${C})`;
    prevEndValue = nerdamer(fullExpr).evaluate({ x: b }).valueOf();
    integrals.push([fullExpr, [a, b]]);
  }

  const rawStart = nerdamer(integrals[0][0]).evaluate({ x: integrals[0][1][0] }).valueOf();
  const rawEnd = nerdamer(integrals.at(-1)![0]).evaluate({ x: integrals.at(-1)![1][1] }).valueOf();

  const rawSpan = rawEnd - rawStart;
  const targetSpan = rangeEnd - rangeStart;

  const scale = targetSpan / rawSpan;

  const adjusted: PiecewiseFunction = integrals.map(([expr, [a, b]]) => {
    return [`(${scale})*(${expr}) + (${rangeStart - scale * rawStart})`, [a, b]];
  });

  return adjusted;
}

export function evaluatePiecewise(
  piecewise: PiecewiseFunction,
  x: number
): number {
  if (!piecewise || piecewise.length === 0) return NaN;

  for (const [expr, [a, b]] of piecewise) {
    if (x >= a && x <= b) {
      try {
        return nerdamer(expr).evaluate({ x }).valueOf();
      } catch {
        return NaN;
      }
    }
  }

  const [firstExpr, [a1]] = piecewise[0];
  const [lastExpr, [, bN]] = piecewise.at(-1)!;

  try {
    if (x < a1) return nerdamer(firstExpr).evaluate({ x: a1 }).valueOf();
    if (x > bN) return nerdamer(lastExpr).evaluate({ x: bN }).valueOf();
  } catch {
    return NaN;
  }

  return NaN;
}
