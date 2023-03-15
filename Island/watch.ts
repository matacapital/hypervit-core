import { build } from "npm:vite@^4.0.0";
import { ViteOptions } from "./ViteOptions.ts";

export const watchIslands = async (): Promise<void> => {
  ViteOptions.build.watch = {};
  await build(ViteOptions);
};
