import { SquareID } from "./squareID";

describe("SquareID", () => {
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

  it("adds rank correctly", () => {
    const id = new SquareID(1, 1);
    id.addRank();
    expect(id.rank).toBe(2);
    id.addRank(2);
    expect(id.rank).toBe(4);
    expect(() => id.addRank(100)).toThrow();
    id.rank = 1;
    expect(() => id.addRank(-100)).toThrow();
  });

  it("adds file correctly", () => {
    const id = new SquareID(1, 1);
    id.addFile();
    expect(id.file).toBe(2);
    id.addFile(2);
    expect(id.file).toBe(4);
    expect(() => id.addFile(-100)).toThrow();
    id.file = 1;
    expect(() => id.addFile(100)).toThrow();
  });

  it("checks equality correctly", () => {
    const test = new SquareID(1, 2);
    const equal = new SquareID("a", 2);
    const notEqual = new SquareID("b", 2);
    expect(test.equals(equal)).toBe(true);
    expect(test.equals(notEqual)).toBe(false);
  });

  it("creates fileStr correctly", () => {
    const test = new SquareID(1, 2);
    expect(test.fileStr).toBe("a");
  });
});

describe("SquareID.file2str", () => {
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
});

describe("SquareID.str2file", () => {
  it("parses string file to integer correctly", () => {
    const files = "abcdefgh";
    for (let i = 1; i <= 8; i++) {
      expect(SquareID.str2file(files[i - 1])).toEqual(i);
    }
  });

  it("throw error when parsing invalid string to file number", () => {
    const invalidInputs = ["ab", "j", "ammar", "a9"];
    for (let invalid of invalidInputs) {
      expect(() => SquareID.str2file(invalid)).toThrow();
    }
  });
});

describe("SquareID.str2id", () => {
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

  it("throws errors for invalid inputs", () => {
    const invalidInputs = ["abc", "a9", "aa"];
    for (let invalid of invalidInputs) {
      expect(() => SquareID.str2id(invalid)).toThrow();
    }
  });
});

describe("SquareID.fromFlatIdx", () => {
  it("throws error for invalid inputs", () => {
    const invalidInputs = [-1, 68, 100];
    for (let invalid of invalidInputs) {
      expect(() => SquareID.fromFlatIdx(invalid)).toThrow();
    }
  });

  it("generates flat indices for the non-reverse order correctly", () => {
    const inputs = [0, 7, 14];
    const expected = ["a8", "h8", "g7"];
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const result = expected[i];
      expect(
        SquareID.fromFlatIdx(input, false).toString(),
      ).toBe(result);
    }
  });

  it("generates flat indices for the reverse order correctly", () => {
    const inputs = [0, 7, 14];
    const expected = ["h1", "a1", "b2"];
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const result = expected[i];
      expect(
        SquareID.fromFlatIdx(input, true).toString(),
      ).toBe(result);
    }
  });
});

describe("SquareID.isValid", () => {
  it("works as intended for string file input", () => {
    expect(SquareID.isValid("a", 10)).toBe(false);
    expect(SquareID.isValid("a", 2)).toBe(true);
  });

  it("works as intended for number inputs", () => {
    expect(SquareID.isValid(10, 10)).toBe(false);
    expect(SquareID.isValid(0, 10)).toBe(false);
    expect(SquareID.isValid(10, 0)).toBe(false);
    expect(SquareID.isValid(1, 2)).toBe(true);
  });

  it("warns if invalid string input", () => {
    expect(SquareID.isValid("ab", 10)).toBe(false);
  });

  it("works as intended for float values", () => {
    expect(SquareID.isValid(1.2, 3.3)).toBe(false);
  });
});
