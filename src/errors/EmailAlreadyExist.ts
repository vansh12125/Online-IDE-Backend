export default class EmailAlreadyExist extends Error {
  constructor(message = "Email Already Exist") {
    super(message);
    this.name = "EmailAlreadyExist";
  }
}