export default class UsernameAlreadyExist extends Error {
  constructor(message = "Username Already Exist") {
    super(message);
    this.name = "UsernameAlreadyExist";
  }
}