
export class ValueError extends Error {
  public value?: any;
  constructor(message: string = "Invalid value", value?: any) {
    super(message);
    this.value = value;
    this.name = "ValueError"
  }
}

