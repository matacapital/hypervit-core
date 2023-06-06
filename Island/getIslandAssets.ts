import { getIsland } from "./getIsland.ts";
import { ManifestType } from "./types.ts";

export const getIslandAssets = (name: string): ManifestType[] => {
  const result: ManifestType[] = [];
  const island = getIsland(name);

  if (island?.imports) {
    island?.imports.map((i) => {
      const resource = getIsland(i.replace(/^islands\//i, ""));
      if (resource) {
        result.push(resource);
      }
    });
  }

  if (island) {
    result.push(island);
  }

  return result;
};
