import { asset } from "./asset.ts";
import {
  File,
  get,
  getIslandAssets,
  Keys,
  LocalConfigType,
  renderToString,
} from "./deps.ts";
import { renderViewType, ViewType } from "./types.ts";

export const renderView: renderViewType = <T = unknown>(
  View: ViewType<T>,
  data?: T,
): string => {
  const config = get<LocalConfigType>(Keys.Config.App);
  const varDir = config.directories.var;

  // @ts-ignore: trust me
  let html = renderToString(<View {...(data ?? {})} />);
  html = `<!DOCTYPE html>${html}`;

  // Render island scripts and styles
  let styles = "";
  let scripts = "";

  const resourcesCache: string[] = [];

  html = html.replace(
    /data-hypervit-island-name ?= ?['"]([a-z0-9\/\._-]+)['"]/ig,
    (token: string, name: string) => {
      const resources = getIslandAssets(name);
      resources.forEach((resource) => {
        if (resource.css) {
          resource.css.forEach((css) => {
            if (!resourcesCache.includes(css)) {
              styles += `<link rel="stylesheet" href="${
                asset("dist/hypervit/" + css)
              }">\n`;
              resourcesCache.push(css);
            }
          });
        }

        if (!resourcesCache.includes(resource.file)) {
          scripts += `<script type="module" crossorigin src="${
            asset("dist/hypervit/" + resource.file)
          }"></script>\n`;
          resourcesCache.push(resource.file);
        }
      });
      return "";
    },
  );

  // Set global data
  const store: {
    islands: {
      data: Record<string, unknown>;
    };
  } = {
    islands: { data: {} },
  };

  html = html.replace(
    /data-hypervit-island-data-id ?= ?['"]([a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+-[a-z0-9]+)['"]/ig,
    (token: string, id: string) => {
      const cacheDataFile = new File(`${varDir}/cache/islands/data/${id}.json`);
      store.islands.data[id] = cacheDataFile.json();
      cacheDataFile.rm();

      return token;
    },
  );

  html = html.replace(
    `<meta name="description" content="hypervit-island-styles-fb26a3d7-6e80-4cda-a797-3c0163a517fc"/>`,
    styles,
  );
  html = html.replace(
    `<span style="display:none;" class="hypervit-island-scripts-e10a91b1-a672-4ff1-9d72-1150f3becaa0"></span>`,
    `<script>
      window.hypervit = {store: ${JSON.stringify(store)}};
    </script>\n
    ${scripts}
    `,
  );

  return html;
};
