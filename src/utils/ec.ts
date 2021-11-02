import { fermatModInv, mod, pow } from "./math";

export type Point = { x: bigint; y: bigint; };
export type EllipticCurve = { a: bigint; b: bigint; p: bigint }

export const ecPointAdd = (p: Point, q: Point, ec: EllipticCurve): Point => {
  let m = divPosDen(p.y - q.y, p.x - q.x, ec.p);
  let rx = (m*m - p.x - q.x);
  rx = mod(rx, ec.p);
  let ry = (m * (p.x - rx) - p.y);
  ry = mod(ry, ec.p);
  return { x: rx, y: ry };
};

export const ecPointSub = (p: Point, q: Point, ec: EllipticCurve): Point => {
  let m = divPosDen(p.y + q.y, p.x - q.x, ec.p);
  let rx = (m*m - p.x - q.x);
  rx = mod(rx, ec.p);
  let ry = (m * (p.x - rx) - p.y);
  ry = mod(ry, ec.p);
  return { x: rx, y: ry };
};

export const ecPointDup = (p: Point, ec: EllipticCurve): Point => {
  let m = divPosDen(3n * pow(p.x, 2n) + ec.a, 2n * p.y, ec.p);
  let rx = (m*m - (2n * p.x));
  rx = mod(rx, ec.p);
  let ry = (m * (p.x - rx) - p.y);
  ry = mod(ry, ec.p);
  return { x: rx, y: ry };
};

export const ecPointMult = (p: Point, k: bigint, ec: EllipticCurve): Point => {
  if (k == 1n) {
    return p
  } if (k % 2n == 1n) {
    return ecPointAdd(ecPointDup(ecPointMult(p, (k - 1n) / 2n, ec), ec) , p, ec);
  } else {
    return ecPointDup(ecPointMult(p, k / 2n, ec), ec);
  }
};

const divPosDen = (num: bigint, den: bigint, m: bigint): bigint => {
  if (den < 0)
    return mod(-num * fermatModInv(-den, m), m)
  else 
    return mod(num * fermatModInv(den, m), m)
}