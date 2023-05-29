import { compileIslands } from "./compile.ts";
import { EnvHelper, File, get, Helper, Keys } from "./deps.ts";
import { IslandException } from "./IslandException.ts";
import { IslandNotFoundException } from "./IslandNotFoundException.ts";
import { IslandConfigType, LocalConfigType, ManifestType } from "./types.ts";

export const getIsland = async (
  island: string,
): Promise<IslandConfigType> => {
  const name = Helper.trim(island, "/").replace(/\.tsx$/i, "");
  const config = get<LocalConfigType>(Keys.Config.App);

  const file = new File(`${config.directories.islands}/${name}.tsx`);
  if (!file.exists()) {
    throw new IslandNotFoundException(`Cannot found island ${name}.tsx`);
  }

  const updatedAt = file.updatedAt()?.getTime() as number;

  const cacheFile = new File(
    `${config.directories.var}/cache/islands/${name}.json`,
  );

  if (cacheFile.exists()) {
    const cachedIsland = cacheFile.json<string | number>();

    if (cachedIsland.updatedAt === updatedAt) {
      return {
        id: cachedIsland.id as string,
        name: cachedIsland.name as string,
        updatedAt,
      };
    }
  }

  let content = file.read();

  const id = crypto.randomUUID();

  content = `import { render } from "solid-js/web";

  ${content}
const elements = document.querySelectorAll<HTMLDivElement>(
  'div[data-hypervit-island-id="${id}"]',
);
elements.forEach((element) => {
  const data = window.hypervit.store.islands.data;
  const useData = (key: string) => data[key] ?? null;
  element.innerHTML = "";
  render(() => <${file.getName()} useData={useData} />, element);
});
  `;

  const proxyFileName = `${config.directories.islands}/${name}.__proxy__.tsx`;
  const proxyFile = new File(proxyFileName);
  proxyFile.write(content);

  const envHelper = get<EnvHelper>(Keys.Env.Helper);

  await compileIslands(
    proxyFile.getPath(),
    envHelper.isLocal() ? "development" : "production",
  );
  proxyFile.rm();

  const publicDir = config.directories.public;
  const manifestFile = new File(`${publicDir}/manifest.json`);

  if (!manifestFile.exists()) {
    throw new IslandException(`Cannot found "${publicDir}/manifest.json"`);
  }

  const manifest = manifestFile.json<ManifestType>();

  const details = manifest[proxyFileName];
  const src = details.src?.replace(/\.__proxy__/, "");
  details["src"] = src;
  manifest[proxyFileName] = details;

  const data = {
    id,
    name,
    updatedAt,
    assets: manifest[proxyFileName],
  };

  cacheFile.writeJson(data);

  return { id, name, updatedAt };
};
