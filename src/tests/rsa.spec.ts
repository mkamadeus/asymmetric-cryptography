import { expect } from "chai";
import cryptography from "~/utils/cryptography";

describe("rsa", () => {
  it("should make key correctly", () => {
    const p = 3n;
    const q = 11n;
    const e = 7n;
    const key = cryptography.rsa.keygen(p, q, e);

    expect(key.pub.e).to.equal(7n);
    expect(key.pub.n).to.equal(33n);
    expect(key.priv.d).to.equal(3n);
    expect(key.priv.n).to.equal(33n);
  });

  it("should encrypt correctly", () => {
    const p = 3n;
    const q = 11n;
    const e = 7n;
    const key = cryptography.rsa.keygen(p, q, e);
    const msg = 2n;
    const encrypted = cryptography.rsa.encrypt(msg, key.pub);
    expect(encrypted).to.equal(29n);
  });

  it("should decrypt correctly", () => {
    const p = 3n;
    const q = 11n;
    const e = 7n;
    const key = cryptography.rsa.keygen(p, q, e);
    const encrypted = 29n;
    const msg = cryptography.rsa.decrypt(encrypted, key.priv);
    expect(msg).to.equal(2n);
  });
});
