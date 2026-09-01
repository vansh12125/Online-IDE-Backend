export default class UserNotFound extends Error {
  constructor(message = "User Not Found") {
    super(message);
    this.name = "UserNotFound";
  }
}
