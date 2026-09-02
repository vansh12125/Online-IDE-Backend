export default class InvalidCredentials extends Error {
  constructor(message = "Invalid username or password") {
    super(message);
    this.name = "InvalidCredentials";
  }
}