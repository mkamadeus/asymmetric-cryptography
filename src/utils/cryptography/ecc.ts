import { ecPointAdd, ecPointMult, ecPointSub, EllipticCurve, Point } from "../ec";

type ECCPublicKey = { ec: EllipticCurve; B: Point; Q: Point, k: bigint };
type ECCPrivateKey = { ec: EllipticCurve; B: Point; x: bigint, k: bigint };
export type ECCKey = {
  pub: ECCPublicKey;
  priv: ECCPrivateKey;
};

export const eccGenerateKey = (
    ec: EllipticCurve, B: Point, x: bigint, k: bigint
): ECCKey => {
  if (x < 0) throw Error("x should be greater than or equalt to 0");
  if (x >= ec.p) throw Error("x should be less than p")

  const Q = ecPointMult(B, x, ec)

  return {
    pub: { ec, B, Q, k },
    priv: { ec, B, x, k },
  };
};

export const eccEncrypt = (
  plain: Point,
  key: ECCPublicKey,
  k: bigint
): [Point, Point] => {
  const a = ecPointMult(key.B, k, key.ec);
  const b = ecPointAdd(plain, ecPointMult(key.Q, k, key.ec), key.ec);
  return [a, b];
};

export const eccDecrypt = (
  cipher: [Point, Point],
  key: ECCPrivateKey
): Point => {
  const [a, b] = cipher;
  const plain = ecPointSub(b, ecPointMult(a, key.x, key.ec), key.ec)
  return plain;
};
