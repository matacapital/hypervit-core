import { getOptions } from "./ViteOptions.ts";
import { build, EnvHelper, get, Keys } from "./deps.ts";

export const compileIslands = async (): Promise<void> => {
  const envHelper = get<EnvHelper>(Keys.Env.Helper);

  const viteOptions = getOptions(
    envHelper.isLocal() ? "development" : "production",
  );

  // @ts-ignore: trust me
  await build(viteOptions);
};
