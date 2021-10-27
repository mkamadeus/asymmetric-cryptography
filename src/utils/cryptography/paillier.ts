import { pow, isPrime, gcd, isCoprime } from "~/utils/math";

type PaillierPublicKey = { g: bigint; n: bigint };
type PaillierPrivateKey = { lambda: bigint; mu: bigint; n: bigint };
export type PaillierKey = {
  pub: PaillierPublicKey;
  priv: PaillierPrivateKey;
};

export const paillierGenerateKey = (
  p: bigint,
  q: bigint,
  g: bigint
): PaillierKey => {
  if (!isPrime(p) || !isPrime(q)) throw Error("p and q should be prime");
  if (!isCoprime(p * q, (p - 1n) * (q - 1n)))
    throw Error("pq and (p-1)(q-1) should be coprime");

  const n = p * q;
  const lambda = ((p - 1n) * (q - 1n)) / gcd(p - 1n, q - 1n);

  if (g >= pow(n, 2n)) throw Error("g should be smaller than n^2");
  const x = pow(g, lambda) % pow(n, 2n);
  const lx = (x - 1n) / n;

  let mu = 0n;
  while ((mu * lx) % n != 1n && mu < n) mu++;
  if (mu == n) throw Error("no suitable mu found");

  return {
    pub: {
      g,
      n,
    },
    priv: {
      lambda,
      mu,
      n,
    },
  };
};

export const paillierEncrypt = (
  m: bigint,
  key: PaillierPublicKey,
  r: bigint
): bigint => {
  if (!isCoprime(r, key.n)) throw Error("r and n should be coprime");
  const n2 = pow(key.n, 2n);
  const c = ((pow(key.g, m) % n2) * (pow(r, key.n) % n2)) % n2;
  return c;
};

export const paillierDecrypt = (c: bigint, key: PaillierPrivateKey): bigint => {
  const x = pow(c, key.lambda) % pow(key.n, 2n);
  const lx = (x - 1n) / key.n;
  const m = ((lx % key.n) * (key.mu % key.n)) % key.n;
  return m;
};
