import { pow, isPrime, randbigint } from "~/utils/math";

type ElGamalPublicKey = { y: bigint; g: bigint; p: bigint };
type ElGamalPrivateKey = { x: bigint; p: bigint };
export type ElGamalKey = {
  pub: ElGamalPublicKey;
  priv: ElGamalPrivateKey;
};

export const elGamalGenerateKey = (p: bigint): ElGamalKey => {
  if (!isPrime(p)) throw Error("p not prime");

  // random g, x
  const g = randbigint(p);
  const x = randbigint(p - 1n);

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
  key: ElGamalPublicKey
): [bigint, bigint] => {
  // random k
  const k = randbigint(key.p);

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
