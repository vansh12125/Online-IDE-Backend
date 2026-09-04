export default class ProjectNotFound extends Error {
  constructor(message = "Project Not Found") {
    super(message);
    this.name = "ProjectNotFound";
  }
}
