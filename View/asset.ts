import { EnvHelper, Helper } from "./deps.ts";

export const asset = (name: string): string => {
  name = Helper.trim(name, "/ ");

  return name.replace(/\[hash\]/, EnvHelper.getHash());
};
