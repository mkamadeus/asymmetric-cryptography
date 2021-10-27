import { expect } from "chai";
import cryptography from "~/utils/cryptography";

describe("paillier", () => {
  it("should make key correctly", () => {
    const p = 7n;
    const q = 11n;
    const g = 5652n;
    const key = cryptography.paillier.keygen(p, q, g);

    expect(key.pub.g).to.equal(5652n);
    expect(key.pub.n).to.equal(77n);
    expect(key.priv.lambda).to.equal(30n);
    expect(key.priv.mu).to.equal(74n);
    expect(key.priv.n).to.equal(77n);
  });

  it("should encrypt correctly", () => {
    const p = 7n;
    const q = 11n;
    const g = 5652n;
    const key = cryptography.paillier.keygen(p, q, g);
    const m = 42n;
    const r = 23n;
    const c = cryptography.paillier.encrypt(m, key.pub, r);
    expect(c).to.equal(4624n);
  });

  it("should decrypt correctly", () => {
    const p = 7n;
    const q = 11n;
    const g = 5652n;
    const key = cryptography.paillier.keygen(p, q, g);
    const c = 4624n;
    const m = cryptography.paillier.decrypt(c, key.priv);
    expect(m).to.equal(42n);
  });
});
