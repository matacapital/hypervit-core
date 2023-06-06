import { File, get, Keys } from "./deps.ts";
import { getIsland } from "./getIsland.ts";
import { IslandPropsType, LocalConfigType, ManifestType } from "./types.ts";

export const Island = (props: IslandPropsType) => {
  const config = get<LocalConfigType>(Keys.Config.App);
  const varDir = config.directories.var;
  const { name, children } = props;

  const manifest = getIsland(name);
  const srcFile = new File(manifest.src);

  let islandId: string | null = null;

  if (srcFile.exists()) {
    const match = srcFile.read().match(
      /['"]__([a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+)__['"]/,
    );

    if (match) {
      islandId = match[1];
    }
  }

  if (islandId) {
    const dataId = crypto.randomUUID();

    const cacheDataFile = new File(
      `${varDir}/cache/islands/data/${dataId}.json`,
    );
    delete props["children"];
    cacheDataFile.writeJson(props);

    return (
      <div
        data-hypervit-island-id={islandId}
        data-hypervit-island-name={name}
        data-hypervit-island-data-id={dataId}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      data-hypervit-island-id={islandId}
      data-hypervit-island-name={name}
    >
      {props.children}
    </div>
  );
};
