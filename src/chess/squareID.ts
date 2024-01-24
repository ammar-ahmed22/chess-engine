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

  /**
   * Checks if another SquareID is equal to this
   * @param other Other SquareID
   * @returns
   */
  public equals(other: SquareID): boolean {
    return (
      this.rank === other.rank && this.file === other.file
    );
  }

  get boardIdx(): [number, number] {
    const row = 8 - this.rank;
    const col = this.file - 1;
    return [row, col];
  }

  get fileStr() {
    return SquareID.file2str(this.file);
  }

  /**
   * Validates the rank and file values
   */
  private validate() {
    if (
      !Number.isInteger(this.rank) ||
      !Number.isInteger(this.file)
    ) {
      throw new TypeError(
        "File and rank must be integers!",
      );
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
      throw new Error("File must be between 1-8!");
    }
    if (!Number.isInteger(file))
      throw new Error("Must be an integer!");

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

  /**
   * Creates SquareID from a flattened board matrix index
   * @param idx The index of the flattened board matrix
   * @param reversedBoard True if the flattened board matrix is in reverse order
   * @returns
   */
  static fromFlatIdx(
    idx: number,
    reversedBoard: boolean = false,
  ) {
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
  static isValid(
    file: number | string,
    rank: number,
  ): boolean {
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
}
