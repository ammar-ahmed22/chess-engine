import { ValueError } from "../utils/error";
import type { SquareIDType, Color } from "../Chess";

class SquareID {
  public rank: number;
  public file: number;
  constructor(file: number, rank: number);
  constructor(file: string, rank: number);
  constructor(algebraic: string);
  constructor(...args: any[]) {
    if (args.length === 2) {
      this.rank = args[1];
      if (typeof args[0] === "string") {
        this.file = SquareID.str2file(args[0]);
      } else {
        this.file = args[0];
      }
    } else {
      if (args[0].length !== 2) {
        throw TypeError("Algebraic id must be only 2 characters!");
      }
      let file = args[0][0];
      let rank = args[0][1];
      this.file = SquareID.str2file(file);
      this.rank = parseInt(rank);
    }
    this.validate();
  }

  /**
   * Checks if another SquareID is equal to this
   * @param other Other SquareID
   * @returns
   */
  public equals(other: SquareID): boolean {
    return this.rank === other.rank && this.file === other.file;
  }

  /**
   * Gets the corresponding indices in the matrix
   *
   * @readonly
   * @type {[number, number]}
   */
  get matrixID(): [number, number] {
    const row = 8 - this.rank;
    const col = this.file - 1;
    return [row, col];
  }

  
  /**
   * Gets the file as a string
   *
   * @readonly
   * @type {string}
   */
  get fileStr() {
    return SquareID.file2str(this.file);
  }

  
  /**
   * Gets the square id in algebraic notation
   *
   * @readonly
   * @type {string}
   */
  get algebraic() {
    return this.fileStr + this.rank.toString();
  }

  
  /**
   * Gets the color of the square
   *
   * @readonly
   * @type {Color}
   */
  get color(): Color {
    const sum = this.file + this.rank;
    return (sum % 2 === 0) ? "white" : "black"
  }

  /**
   * Validates the rank and file values
   */
  private validate() {
    if (
      !Number.isInteger(this.rank) ||
      !Number.isInteger(this.file)
    ) {
      throw new TypeError("File and rank must be integers!");
    }
    if (this.file < 1 || this.file > 8) {
      throw new RangeError(`File = '${this.file}' is out of range!`);
    }
    if (this.rank < 1 || this.rank > 8) {
      throw new RangeError(`Rank = '${this.rank}' is out of range!`);
    }
  }

  /**
   * Copies this SquareID to another instance
   * @returns
   */
  public copy(): SquareID {
    return new SquareID(this.file, this.rank);
  }

  /**
   * Adds a number to the file
   * @param add The value to add (can be negative)
   * @returns
   */
  public addFile(add: number = 1): SquareID {
    this.file += add;
    this.validate();
    return this;
  }

  /**
   * Adds a number to the rank
   * @param add The value to add (can be negative)
   * @returns
   */
  public addRank(add: number = 1): SquareID {
    this.rank += add;
    this.validate();
    return this;
  }

  /**
   * Creates square id string
   * @returns square id string (e.g a6)
   */
  public toString() {
    return `${SquareID.file2str(this.file)}${this.rank}`;
  }

  /**
   * Converts an integer file number to string
   * @param file Integer representing the file number (e.g. 1)
   * @returns The corresponding file (e.g. a)
   */
  static file2str(file: number): string {
    if (file < 1 || file > 8) {
      throw new ValueError("File must be between 1-8!", file);
    }
    if (!Number.isInteger(file))
      throw new ValueError("Must be an integer!", file);

    return String.fromCharCode(96 + file);
  }

  /**
   * Converts a file to its integer format
   * @param file String file (e.g. a)
   * @returns The corresponding integer file (e.g. 1)
   */
  static str2file(file: string): number {
    const allowed = "abcdefgh";
    if (file.length !== 1) {
      throw new Error("File must be a single character!");
    }

    if (!allowed.includes(file)) {
      throw new Error(`File: '${file}' is invalid!`);
    }

    return file.charCodeAt(0) - 96;
  }

  /**
   * Converts string square id to SquareID
   * @param id square identifier (e.g. a5)
   */
  static str2id(id: string): SquareID {
    if (id.length !== 2) {
      throw new Error(`Invalid id: '${id}'`);
    }

    const file = id[0];
    if (isNaN(parseInt(id[1]))) {
      throw new Error(`Invalid id: '${id}'`);
    }
    const rank = parseInt(id[1]);
    return new SquareID(file, rank);
  }

  // TODO possibly remove this
  /**
   * Creates SquareID from a flattened board matrix index
   * @param idx The index of the flattened board matrix
   * @param reversedBoard True if the flattened board matrix is in reverse order
   * @returns
   */
  static fromFlatIdx(idx: number, reversedBoard: boolean = false) {
    if (idx < 0 || idx > 63) {
      throw new RangeError("Flat index must between 0-63");
    }
    const row = Math.floor(idx / 8);
    const col = idx % 8;
    if (!reversedBoard) {
      const rank = 8 - row;
      const file = col + 1;
      return new SquareID(file, rank);
    } else {
      const rank = row + 1;
      const file = 8 - col;
      return new SquareID(file, rank);
    }
  }

  static isValid(file: number, rank: number): boolean;
  static isValid(file: string, rank: number): boolean;
  static isValid(algebraic: string): boolean;
  static isValid(...args: (number | string)[]): boolean {
    let file: number | string;
    let rank: number;
    if (args.length === 2) {
      file = args[0];
      rank = args[1] as number;
    } else {
      let alg = args[0] as string;
      if (typeof alg !== "string" || alg.length !== 2) {
        return false;
      }
      file = alg[0];
      rank = parseInt(alg[0]);
      if (isNaN(rank)) return false;
    }

    if (typeof file === "string") {
      const allowed = "abcdefgh";
      if (file.length !== 1 || !allowed.includes(file)) {
        console.warn(
          "SquareID.isValid returned false due to invalid string input!",
        );
        return false;
      }
      file = SquareID.str2file(file);
      if (
        !Number.isInteger(file) ||
        !Number.isInteger(rank) ||
        file < 1 ||
        file > 8 ||
        rank < 1 ||
        rank > 8
      )
        return false;
      return true;
    } else {
      if (
        !Number.isInteger(file) ||
        !Number.isInteger(rank) ||
        file < 1 ||
        file > 8 ||
        rank < 1 ||
        rank > 8
      )
        return false;
      return true;
    }
  }

  static fromSquareIDType(id: SquareIDType): SquareID {
    if (typeof id === "string") {
      return new SquareID(id);
    } else {
      if (typeof id.file === "string") {
        return new SquareID(id.file, id.rank);
      } else {
        return new SquareID(id.file, id.rank);
      }
    }
  }
}

export default SquareID;
