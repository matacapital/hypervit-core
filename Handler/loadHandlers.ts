import { Directory, IFile } from "./deps.ts";

export const loadHandlers = (dir: string): IFile[] => {
  // Load all app handlers
  const directory = new Directory(dir);
  const handlers = directory.files(/Handler\.ts$/, true);

  return handlers;
};
