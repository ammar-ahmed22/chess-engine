import Piece from "./pieces";
import Pawn from "./pieces/pawn";

export class SquareID {
  public rank: number;
  public file: number;
  constructor(file: number, rank: number);
  constructor(file: string, rank: number);
  constructor(file: number | string, rank: number) {
    this.rank = rank;
    if (typeof file == "string") {
      this.file = SquareID.str2file(file);
    } else {
      this.file = file;
    }
    this.validate();
  }

  get boardIdx(): [number, number] {
    const row = 8 - this.rank;
    const col = this.file - 1;
    return [row, col];
  }

  private validate() {
    if (!Number.isInteger(this.rank) || !Number.isInteger(this.file)) {
      throw new TypeError("File and rank must be integers!");
    }
    if (this.file < 1 || this.file > 8) {
      throw new RangeError(
        `File = '${this.file}' is out of range!`,
      );
    }
    if (this.rank < 1 || this.rank > 8) {
      throw new RangeError(
        `Rank = '${this.rank}' is out of range!`,
      );
    }
  }

  public copy(): SquareID {
    return new SquareID(this.file, this.rank);
  }

  public addFile(add: number = 1): SquareID {
    this.file += add;
    this.validate();
    return this;
  }

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
      throw new Error("File must be between 1-8!");
    }
    if (!Number.isInteger(file)) throw new Error("Must be an integer!")

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
}

type MoveConstructorParams = {
  white?: boolean;
  from: SquareID;
  to: SquareID;
  castle?: boolean;
  take?: Piece;
  piece: Piece;
};

class Move {
  public white: boolean = true;
  public from: SquareID = new SquareID(1, 1);
  public to: SquareID = new SquareID(1, 1);
  public castle: boolean = false;
  public take?: Piece;
  public piece: Piece = new Pawn(this.white, this.from);
  constructor(params: MoveConstructorParams) {
    Object.assign(this, params);
  }
}

export default Move;
