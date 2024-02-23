export class ValueError extends Error {
  public value?: any;
  constructor(message: string = "Invalid value", value?: any) {
    super(message);
    this.value = value;
    this.name = "ValueError";
  }
}

/**
 * Returns null with a warning message
 * @param message Warning message
 * @param silent If true, message will not be logged
 * @returns
 */
export const nullMessage = (
  message: string,
  silent?: boolean,
): null => {
  if (!silent) console.warn(message);
  return null;
};
