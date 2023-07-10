import { UrlGenerationException } from "./UrlGenerationException.ts";
import { Collection, Helper, RouteDefinitionType } from "./deps.ts";

export const Router = new Collection<string, RouteDefinitionType>();

export const generateUrl = (
  routeName: string,
  params: Record<string, string | number> = {},
  baseUrl?: URL | null,
): string => {
  const route: RouteDefinitionType | null = Router.get(routeName) ?? null;

  if (!route) {
    throw new UrlGenerationException(`Cannot found route "${routeName}"`);
  }

  params = { ...(route.default ?? {}), ...params };

  const path = route.path.replace(
    /:+([a-z0-9_-]+)/gi,
    (_match, param) => {
      if (!Helper.hasProperty(params, param)) {
        throw new UrlGenerationException(`Param "${param}" not defined`);
      }

      return `${params[param]}`;
    },
  );

  if (baseUrl) {
    return `${baseUrl.protocol}//${baseUrl.host}${path}`;
  }

  return path;
};
