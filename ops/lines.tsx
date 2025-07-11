import { buildPiecewiseFunction, integratePiecewise, evaluatePiecewise } from './buildPiecewiseFunction';

const a1 = 1;
const b1 = 1;
const whole_k1 = 1;
const line1 = buildPiecewiseFunction(
  [0, 1],0,
  { expr: `${whole_k1}*(${a1}*x^2)`, len: 0.5, area: [-5, null] },
  { expr: `${whole_k1}*(0)`, len: 0.35, area: [0, 1] },
  { expr: `${whole_k1}*(-${b1}*x^2)`, len: 0.15, area: [null, 5] }
);
export const integralLine1 = integratePiecewise([0,1],line1);

const b2 = 1;
const c2 = 1;
const d2 = 1;
const whole_k2 = 1;
const line2 = buildPiecewiseFunction(
  [0, 1],0,
  { expr: `${whole_k2}*(0)`, len: 0.1, area: [0, 1] },
  { expr: `${whole_k2}*(${b2}*x-${c2}*x^3)`, len: 0.36, area: [null, null] },
  { expr: `${whole_k2}*(0)`, len: 0.41, area: [0, 1] },
  { expr: `${whole_k2}*(-${d2}*x^2)`, len: 0.13, area: [null, 5] }
);
export const integralLine2 = integratePiecewise([0,1],line2);

const a3 = 5;
const b3 = 0.4;
const c3 = 1;
const whole_k3 = 1;
const line3 = buildPiecewiseFunction(
  [0, 1],0,
  { expr: `${whole_k3}*(0)`, len: 0.23, area: [0, 1] },
  { expr: `${whole_k3}*(${a3}*x-${b3}*x^3)`, len: 0.18, area: [null, null] },
  { expr: `${whole_k3}*(0)`, len: 0.49, area: [0, 1] },
  { expr: `${whole_k3}*(-${c3}*x^2)`, len: 0.1, area: [null, 5] }
);
export const integralLine3 = integratePiecewise([0,1],line3);

const a4 = 3.7;
const b4 = 0.1;
const c4 = 1;
const whole_k4 = 1;
const line4 = buildPiecewiseFunction(
  [0, 1],0,
  { expr: `${whole_k4}*(0)`, len: 0.235, area: [0, 1] },
  { expr: `${whole_k4}*(${a4}*x-${b4}*x^3)`, len: 0.25, area: [null, null] },
  { expr: `${whole_k4}*(0)`, len: 0.425, area: [0, 1] },
  { expr: `${whole_k4}*(-${c4}*x^2)`, len: 0.09, area: [null, 5] }
);
export const integralLine4 = integratePiecewise([0,1],line4);

const a5_1 = 0.5;
const b5_1 = 1;
const whole_k5_1 = 1;
const line5_1 = buildPiecewiseFunction(
  [0, 1],0.08,
  { expr: `${whole_k5_1}*(1)`, len: 0.2, area: [0, 1] },
  { expr: `${whole_k5_1}*(${a5_1}*x-${b5_1}*x^3)`, len: 0.35, area: [null, null] },
  { expr: `${whole_k5_1}*(0)`, len: 0.45, area: [0, 1] },
);
export const integralLine5_1 = integratePiecewise([0,1],line5_1);

const a5_2 = 0.5;
const b5_2 = 1;
const c5_2 = 1;
const d5_2 = 1;
const whole_k5_2 = 1;
export const line5_2 = buildPiecewiseFunction(
  [0, 1],0,
  { expr: `${whole_k5_2}*(${a5_2}*x-${b5_2}*x^3)`, len: 0.4, area: [null, null] },
  { expr: `${whole_k5_2}*(${c5_2}*x)`, len: 0.2, area: [0, 1] },
  { expr: `${whole_k5_2}*(${d5_2}*x^2)`, len: 0.4, area: [null, 5] }
);

export function line1Ease(t: number): number {
  return evaluatePiecewise(integralLine2, t);
}

export function line2Ease(t: number): number {
  return evaluatePiecewise(integralLine3, t);
}

export function line3Ease(t: number): number {
  return evaluatePiecewise(integralLine4, t);
}