import { SquareID } from "./move";

describe("SquareID", () => {
  it("parses integer file to string correctly", () => {
    const expectedFiles = "abcdefgh";

    for (let i = 1; i <= 8; i++) {
      expect(SquareID.file2str(i)).toEqual(
        expectedFiles[i - 1],
      );
    }
  });

  it("throws error when parsing invalid file number to string", () => {
    expect(() => SquareID.file2str(10)).toThrow();
    expect(() => SquareID.file2str(1.2)).toThrow();
  });

  it("parses string file to integer correctly", () => {
    const files = "abcdefgh";
    for (let i = 1; i <= 8; i++) {
      expect(SquareID.str2file(files[i - 1])).toEqual(i);
    }
  });

  it("throw error when parsing invalid string to file number", () => {
    const invalidInputs = ["ab", "j", "ammar"];
    for (let invalid of invalidInputs) {
      expect(() => SquareID.str2file(invalid)).toThrow();
    }
  });

  it("converts to string correclty", () => {
    const a6 = new SquareID(1, 6);
    const h5 = new SquareID(8, 5);
    const c3 = new SquareID(3, 3);
    expect(a6.toString()).toEqual("a6");
    expect(h5.toString()).toEqual("h5");
    expect(c3.toString()).toEqual("c3");
  });

  it("throws error for invalid input", () => {
    const invalidInputs = [
      [10, 11],
      [-1, -3],
      [1, -1],
      [100, 200],
      [1.2, 1.3],
    ];
    for (let invalid of invalidInputs) {
      expect(
        () => new SquareID(invalid[0], invalid[1]),
      ).toThrow();
    }
  });

  it("creates SquareID from id", () => {
    const tests = ["a6", "b5", "c3", "d1", "e8"];
    const expected = [
      [1, 6],
      [2, 5],
      [3, 3],
      [4, 1],
      [5, 8],
    ];
    for (let i = 0; i < tests.length; i++) {
      const t = tests[i];
      const actual = expected[i];
      expect(() => SquareID.str2id(t)).not.toThrow();
      const id: SquareID = SquareID.str2id(t);
      expect(id.file).toEqual(actual[0]);
      expect(id.rank).toEqual(actual[1]);
    }
  });

  it("throws error when creating SquareID with invalid id", () => {
    const invalidInputs = ["ammar", "aa", "abc"];
    for (let invalid of invalidInputs) {
      expect(() => SquareID.str2id(invalid)).toThrow();
    }
  });

  it("adds rank correctly", () => {
    const id = new SquareID(1, 1);
    id.addRank(1);
    expect(id.rank).toBe(2);
    expect(() => id.addRank(400)).toThrow();
  });

  it("adds file correctly", () => {
    const id = new SquareID(1, 1);
    id.addFile(1);
    expect(id.file).toBe(2);
    expect(() => id.addFile(-100)).toThrow();
  });
});
