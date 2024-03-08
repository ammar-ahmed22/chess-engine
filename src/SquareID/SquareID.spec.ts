import SquareID from "./SquareID";

describe("SquareID", () => {
  it("constructs square ids correctly", () => {
    const a1s = [new SquareID(1, 1), new SquareID("a", 1), new SquareID("a1")];
    for (let a1 of a1s) {
      expect(a1.file).toBe(1);
      expect(a1.rank).toBe(1);
      expect(a1.fileStr).toBe("a");
    }
  })

  it("finds the distance between 2 ids correctly", () => {
    const b7 = new SquareID('b7');
    const a6 = new SquareID("a6");
    expect(b7.distance(a6)).toBe(1);
  })
})