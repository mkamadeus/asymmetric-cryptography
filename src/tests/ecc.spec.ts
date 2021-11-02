import { expect } from "chai";
import cryptography from "~/utils/cryptography";

describe("ecc", () => {
  it("should make key correctly", () => {
    const ec = { a: 1n, b: 6n, p: 11n };
    const B = { x: 2n, y: 4n };
    const x = 2n;
    const k = 5n;
    const key = cryptography.ecc.keygen(ec, B, x, k);

    expect(key.pub.ec.a).to.equal(1n);
    expect(key.pub.ec.b).to.equal(6n);
    expect(key.pub.ec.p).to.equal(11n);
    expect(key.pub.B.x).to.equal(2n);
    expect(key.pub.B.y).to.equal(4n);
    expect(key.pub.Q.x).to.equal(5n);
    expect(key.pub.Q.y).to.equal(9n);
    expect(key.priv.ec.a).to.equal(1n);
    expect(key.priv.ec.b).to.equal(6n);
    expect(key.priv.ec.p).to.equal(11n);
    expect(key.priv.B.x).to.equal(2n);
    expect(key.priv.B.y).to.equal(4n);
    expect(key.priv.x).to.equal(2n);
  });

  // mager bikin testnya :v
  // it("should encrypt correctly", () => {
  //   const ec = { a: -1n, b: 188n, p: 751n };
  //   const B = { x: 2n, y: 4n };
  //   const x = 2n;
  //   const k = 5n;
  //   const key = cryptography.ecc.keygen(ec, B, x, k);

  //   const msg = 2035n;
  //   const randK = 1520n;
  //   const encrypted = cryptography.elgamal.encrypt(msg, key.pub, k);

  //   expect(encrypted[0]).to.equal(1430n);
  //   expect(encrypted[1]).to.equal(697n);
  // });

  // it("should decrypt correctly", () => {
  //   const p = 2357n;
  //   const g = 2n;
  //   const x = 1751n;
  //   const key = cryptography.elgamal.keygen(p, g, x);
  //   const encrypted: [bigint, bigint] = [1430n, 697n];
  //   const msg = cryptography.elgamal.decrypt(encrypted, key.priv);
  //   expect(msg).to.equal(2035n);
  // });
});
