export default class InvalidCredentials extends Error {
  constructor() {
    super("Invalid username or password");
    this.name = "InvalidCredentials";
  }
}