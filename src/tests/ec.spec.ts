import { expect } from "chai";
import { ecPointAdd, ecPointDup } from "~/utils/ec";

describe("ec", () => {
  it("should add correctly", () => {
    const ec = { a: 1n, b: 6n, p: 11n }
    const P = { x: 2n, y: 4n };
    const Q = { x: 5n, y: 9n };

    const R = ecPointAdd(P, Q, ec)

    expect(R.x).to.equal(8n);
    expect(R.y).to.equal(8n);
  });

  it("should dupe correctly", () => {
    const ec = { a: 1n, b: 6n, p: 11n }
    const P = { x: 2n, y: 4n };

    const R = ecPointDup(P, ec)

    expect(R.x).to.equal(5n);
    expect(R.y).to.equal(9n);
  });
});
