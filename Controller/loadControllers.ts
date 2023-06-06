import { NotFoundController } from "./NotFoundController.ts";
import { ServerErrorController } from "./ServerErrorController.ts";
import { Directory, IFile } from "./deps.ts";

export const loadControllers = (dir: string): IFile[] => {
  // Load default NotFoundController
  new NotFoundController();

  // Load default ServerErrorController
  new ServerErrorController();

  // Load all app controllers
  const directory = new Directory(dir);
  const controllers = directory.files(/Controller\.ts$/, true);

  return controllers;
};
