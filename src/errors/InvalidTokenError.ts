export default class InvalidTokenError extends Error {
  constructor(message = "Invalid token") {
    super(message);
    this.name = "InvalidTokenError";
  }
}