import { AssetNotFoundException } from "./AssetNotFoundException.ts";
import { File, get, Helper, Keys } from "./deps.ts";

type LocalConfigType = { directories: { var: string; public: string } };
type GetAssetFromCacheReturnType = { name: string; date: number; id: string };

export const asset = (name: string): string => {
  const config = get<LocalConfigType>(Keys.Config.App);
  const publicDir = config.directories.public;
  name = Helper.trim(name, "/ ");

  if (!name.startsWith("@")) {
    const path = `${publicDir}/${name}`;
    const file = new File(path);

    if (!file.exists()) {
      throw new AssetNotFoundException(
        `Cannot found asset "${file.getPath()}"`,
      );
    }

    return `/${path}`;
  }

  name = Helper.trim(name, "@");
  const file = new File(name);

  if (!file.exists()) {
    return "";
  }

  const updatedAt = file.updatedAt()?.getTime() as number;

  const filename = getAssetFromCache(`${name}`);
  const assetFile = new File(`${publicDir}/${filename.name}`);

  if (!assetFile.exists()) {
    file.cp(`${assetFile.getPath()}`);
  } else {
    if (filename.date !== updatedAt) {
      file.cp(`${assetFile.getPath()}`, { overwrite: true });
    }
  }

  return `${filename.name}`;
};

export const getAssetFromCache = (
  name: string,
): GetAssetFromCacheReturnType => {
  const config = get<LocalConfigType>(Keys.Config.App);
  const directories = config.directories;
  const varDir = directories.var;
  const file = new File(name);
  const assetsCacheFile = new File(`${varDir}/cache/assets/${name}.json`);

  if (!assetsCacheFile.exists()) {
    assetsCacheFile.writeJson({});
  }

  let assetsCacheManifest: GetAssetFromCacheReturnType = assetsCacheFile.json<
    string | number
  >() as GetAssetFromCacheReturnType;

  if (assetsCacheManifest.id) {
    return assetsCacheManifest;
  }

  const id = crypto.randomUUID();
  let hash = "a";
  for (let i = 0; i < 15; i++) {
    hash += `${Helper.randomInt(9)}`;
  }

  const ext = file.getExt();

  assetsCacheManifest = {
    name: `assets/${hash}.${ext}`,
    date: file.updatedAt()?.getTime() as number,
    id,
  };

  assetsCacheFile.writeJson(assetsCacheManifest);

  return assetsCacheManifest;
};
