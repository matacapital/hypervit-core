import { File, get, Keys } from "./deps.ts";
import { IslandException } from "./IslandException.ts";
import { IslandNotFoundException } from "./IslandNotFoundException.ts";
import { LocalConfigType, ManifestType } from "./types.ts";

export const getIsland = (
  name: string,
): ManifestType => {
  const config = get<LocalConfigType>(Keys.Config.App);
  const islandsDir = config.directories.islands;

  name = name.replace(/\.tsx/i, "");

  const islandFile = new File(`${islandsDir}/${name}.tsx`);

  if (!islandFile.exists()) {
    throw new IslandNotFoundException(`Cannot found island "${name}.tsx"`);
  }

  const cacheFile = new File(
    `${config.directories.var}/cache/islands/${name}.js.json`,
  );

  if (cacheFile.exists()) {
    return cacheFile.json() as ManifestType;
  }

  const manifestFile = new File(
    `${config.directories.public}/dist/hypervit/manifest.json`,
  );

  if (!manifestFile.exists()) {
    throw new IslandException(
      `Cannot found "${manifestFile.getPath()}". Make sure to compile islands`,
    );
  }

  const manifest = manifestFile.json<unknown>();

  const data = manifest[`${islandsDir}/${name}.tsx`];

  return data as ManifestType;
};
