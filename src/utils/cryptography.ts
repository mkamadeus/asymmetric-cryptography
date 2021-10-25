import { isCoprime, pow } from "./math";

// RSA

export type RSAKey = {
  pub: {
    n: bigint;
    e: bigint;
  };
  priv: {
    n: bigint;
    d: bigint;
  };
};

export const rsaGenerateKey = (x: bigint, y: bigint, e: bigint): RSAKey => {
  const n = x * y;
  const totient = (x - 1n) * (y - 1n);

  if (e >= totient || e <= 1) throw Error("invalid e value");
  if (!isCoprime(n, e)) throw Error("(n,e) not coprime");

  // extended euclid, search for fitting d
  let d = 0n;
  while ((e * d) % totient !== 1n && d < totient) {
    d++;
  }
  if (d === totient) throw Error("no suiting d found");

  return {
    pub: {
      n,
      e,
    },
    priv: {
      n,
      d,
    },
  };
};

export const rsaEncrypt = (plain: bigint, key: RSAKey): bigint => {
  const { pub } = key;
  const cipher = pow(plain, pub.e) % pub.n;
  return cipher;
};

export const rsaDecrypt = (cipher: bigint, key: RSAKey): bigint => {
  const { priv } = key;
  const plain = pow(cipher, priv.d) % priv.n;
  return plain;
};
