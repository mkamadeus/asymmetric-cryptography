import { isCoprime, pow } from "~/utils/math";

type RSAPublicKey = { n: bigint; e: bigint };
type RSAPrivateKey = { n: bigint; d: bigint };
export type RSAKey = {
  pub: RSAPublicKey;
  priv: RSAPrivateKey;
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

export const rsaEncrypt = (plain: bigint, key: RSAPublicKey): bigint => {
  const cipher = pow(plain, key.e) % key.n;
  return cipher;
};

export const rsaDecrypt = (cipher: bigint, key: RSAPrivateKey): bigint => {
  const plain = pow(cipher, key.d) % key.n;
  return plain;
};
