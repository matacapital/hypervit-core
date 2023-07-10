import {
  EnvHelper,
  HandlerContextType,
  HttpRequest,
  HttpResponse,
  MatchedRouteParamsType,
  MatchedRouteType,
  RouteChecker,
  RouteConfigException,
  RouteDefinitionSchema,
  Router,
} from "./deps.ts";

export const ProxyHandler = (
  req: Request,
  ctx: HandlerContextType,
  routeName: string,
): Promise<Response> | Response => {
  const request = new HttpRequest(req, ctx.params);
  const response = new HttpResponse(ctx);
  const config = Router.get(routeName);

  const result = RouteDefinitionSchema.safeParse(config);
  if (!result.success) {
    const error = result.error.issues[0];

    throw new RouteConfigException(
      `${error.path.join(".")}: ${error.message}`,
    );
  }

  const localAddr = ctx.localAddr as { hostname: string };

  const matchedRoute: MatchedRouteType = {
    url: request.url,
    params: request.params.toJson() as MatchedRouteParamsType,
    method: request.method,
    ip: localAddr.hostname,
    locale: EnvHelper.getLocale(),
    env: EnvHelper.getAppEnv(),
    version: EnvHelper.getVersion(),
  };

  new RouteChecker(config, matchedRoute);

  return config.handler.call(null, request, response);
};
