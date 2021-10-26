import { expect } from "chai";
import cryptography from "~/utils/cryptography";

describe("elgamal", () => {
  it("should make key correctly", () => {
    const p = 2357n;
    const g = 2n;
    const x = 1751n;
    const key = cryptography.elgamal.keygen(p, g, x);

    expect(key.pub.y).to.equal(1185n);
    expect(key.pub.g).to.equal(2n);
    expect(key.pub.p).to.equal(2357n);
    expect(key.priv.x).to.equal(1751n);
    expect(key.priv.p).to.equal(2357n);
  });

  it("should encrypt correctly", () => {
    const p = 2357n;
    const g = 2n;
    const x = 1751n;
    const key = cryptography.elgamal.keygen(p, g, x);
    const msg = 2035n;
    const k = 1520n;
    const encrypted = cryptography.elgamal.encrypt(msg, key.pub, k);
    expect(encrypted[0]).to.equal(1430n);
    expect(encrypted[1]).to.equal(697n);
  });

  it("should decrypt correctly", () => {
    const p = 2357n;
    const g = 2n;
    const x = 1751n;
    const key = cryptography.elgamal.keygen(p, g, x);
    const encrypted: [bigint, bigint] = [1430n, 697n];
    const msg = cryptography.elgamal.decrypt(encrypted, key.priv);
    expect(msg).to.equal(2035n);
  });
});
