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
  }
  // constructor(
  //   public file: number,
  //   public rank: number,
  // ) {}

  
  // Implement getting the string id => a4, e5, etc.
  public toString() {
    return `${SquareID.file2str(this.file)}${this.rank}`
  }

  /**
   * Converts an integer file number to string
   * @param file Integer representing the file number (e.g. 1)
   * @returns The corresponding file (e.g. a)
   */
  static file2str(file: number): string {
    if (file < 1 || file > 8) {
      throw new Error("File must be between 1-8!")
    }
    
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
      throw new Error("File must be a single character!")
    }

    if (!allowed.includes(file)) {
      throw new Error(`File: '${file}' is invalid!`)
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
      throw new Error(`Invalid id: '${id}'`)
    }
    const rank = parseInt(id[1]);
    return new SquareID(file, rank);
  }
}

class Move {
  public white: boolean = true;
  public from: SquareID = new SquareID(0, 0);
  public to: SquareID = new SquareID(0, 0);
  public castle: boolean = false;
  public take?: Piece;
  public piece: Piece = new Pawn();
}

export default Move;
