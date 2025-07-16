function factorial(n: number): number {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

function binomial(n: number, k: number): number {
  return factorial(n) / (factorial(k) * factorial(n - k));
}

export default function bezierPoint(controlPoints: number[][], t: number): number[] {
  const n = controlPoints.length - 1;

  return controlPoints[0].map((_, dim) => {
    let sum = 0;
    for (let i = 0; i <= n; i++) {
      const coeff = binomial(n, i) * Math.pow(1 - t, n - i) * Math.pow(t, i);
      sum += coeff * controlPoints[i][dim];
    }
    return sum;
  });
}


function generateRightPath(points: { x: number; y: number }[]) {
  const reversed = [...points].reverse();

  let d = `M 1 0 L 1 1`;

  for (let i = 0; i < reversed.length - 1; i += 2) {
    const p0 = reversed[i];
    const p1 = reversed[i + 1];
    d += ` Q ${p0.x/100} ${p0.y/100}, ${p1.x/100} ${p1.y/100}`;
  }

  d += ` Z`;
  return d;
}