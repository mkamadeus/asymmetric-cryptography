import { pow, isPrime } from "~/utils/math";

type ElGamalPublicKey = { y: bigint; g: bigint; p: bigint };
type ElGamalPrivateKey = { x: bigint; p: bigint };
export type ElGamalKey = {
  pub: ElGamalPublicKey;
  priv: ElGamalPrivateKey;
};

export const elGamalGenerateKey = (
  p: bigint,
  g: bigint,
  x: bigint
): ElGamalKey => {
  if (!isPrime(p)) throw Error("p not prime");
  if (g >= p) throw Error("g should be less than p");
  if (x >= p - 1n) throw Error("x should be less than p-1");

  const y = pow(g, x) % p;

  return {
    pub: {
      y,
      g,
      p,
    },
    priv: {
      x,
      p,
    },
  };
};

export const elGamalEncrypt = (
  plain: bigint,
  key: ElGamalPublicKey,
  k: bigint
): [bigint, bigint] => {
  const a = pow(key.g, k) % key.p;
  const b = (pow(key.y, k) * plain) % key.p;
  return [a, b];
};

export const elGamalDecrypt = (
  cipher: [bigint, bigint],
  key: ElGamalPrivateKey
): bigint => {
  const [a, b] = cipher;
  const plain = (b * (pow(a, key.p - key.x - 1n) % key.p)) % key.p;
  return plain;
};
