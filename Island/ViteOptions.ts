import { Directory, EnvHelper, get, Keys, solid } from "./deps.ts";
import { LocalConfigType, ViteOptionsModeType } from "./types.ts";

export const getOptions = (
  mode: ViteOptionsModeType,
) => {
  const config = get<LocalConfigType>(Keys.Config.App);
  const envHelper = get<EnvHelper>(Keys.Env.Helper);
  const directories = config.directories;
  const directory = new Directory(directories.islands);
  const islands = directory.files(/\.tsx$/, true);
  const inputs: string[] = [];
  const isDev = mode === "development";
  const isProd = mode === "production";

  islands.forEach((island) => {
    inputs.push(island.getPath());
  });

  const ViteOptions = {
    appType: "custom",
    logLevel: "info",
    mode,
    cacheDir: directories.var,
    build: {
      outDir: `${directories.public}/dist/hypervit`,
      assetsDir: `${directories.islands}`,
      publicDir: `${directories.islands}`,
      sourcemap: isDev,
      minify: isProd,
      manifest: true,
      write: true,
      emptyOutDir: isProd,
      copyPublicDir: false,
      css: {
        devSourcemap: mode === "development",
      },
      rollupOptions: {
        input: inputs,
        output: {
          entryFileNames: `islands/[${isDev ? "name" : "hash:15"}].js`,
          chunkFileNames: `islands/[${isDev ? "name" : "hash:15"}].js`,
          assetFileNames: `islands/${envHelper.getHash()}/[${
            isDev ? "name" : "hash:15"
          }][extname]`,
        },
      },
      watch: (mode === "development") ? {} : null,
    },
    plugins: [solid({
      solid: {
        hydratable: true,
      },
    })],
  };

  return ViteOptions;
};
