// is prime for bigint
export const isPrime = (n: bigint): boolean => {
  if (n <= 1n) return false;
  if (n === 2n) return true;
  if (n % 2n === 0n) return false;

  for (let i = 3n; i * i < n; i += 2n) {
    if (n % i == 0n) return false;
  }

  return true;
};

// gcd for bigint
export const gcd = (x: bigint, y: bigint): bigint => {
  if (y == 0n) return x;
  return gcd(y, x % y);
};

// iscoprime for bigint
export const isCoprime = (x: bigint, y: bigint): boolean => {
  return gcd(x, y) == 1n;
};

// fast expo for bigint
export const pow = (n: bigint, p: bigint): bigint => {
  if (p == 1n) return n;
  if (p % 2n == 1n) return pow(n, p - 1n) * n;

  const half = pow(n, p / 2n);
  return half * half;
};

export const randbigint = (limit: bigint): bigint => {
  return BigInt(
    Math.floor(Math.random() * parseInt(limit.toString()))
  ).valueOf();
};
