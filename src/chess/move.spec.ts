import { SquareID } from "./move";

describe("SquareID", () => {
  it("parses integer file to string correctly", () => {
    const expectedFiles = "abcdefgh";
    
    for (let i = 1; i <= 8; i++) {
      expect(SquareID.file2str(i)).toEqual(expectedFiles[i - 1]);
    }
  })

  it("parses string file to integer correctly", () => {
    const files = "abcdefgh"
    for (let i = 1; i <= 8; i++) {
      expect(SquareID.str2file(files[i - 1])).toEqual(i);
    }
  })

  it("converts to string correclty", () => {
    const a6 = new SquareID(1, 6);
    const h5 = new SquareID(8, 5);
    const c3 = new SquareID(3, 3);
    expect(a6.toString()).toEqual("a6");
    expect(h5.toString()).toEqual("h5");
    expect(c3.toString()).toEqual("c3");
  })

  it("creates SquareID from id", () => {
    const tests = ["a6", "b5", "c3", "d1", "e8"];
    const expected = [[1, 6], [2, 5], [3, 3], [4, 1], [5, 8]];
    for (let i = 0; i < tests.length; i++) {
      const t = tests[i];
      const actual = expected[i];
      expect(() => SquareID.str2id(t)).not.toThrow();
      const id: SquareID = SquareID.str2id(t);
      expect(id.file).toEqual(actual[0]);
      expect(id.rank).toEqual(actual[1]);
    }
  })

  
})