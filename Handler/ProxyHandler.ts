import { RouteDefinitionType } from "./Route/types.ts";
import { HandlerContextType, HttpRequest, HttpResponse } from "./deps.ts";

export const ProxyHandler = (
  req: Request,
  ctx: HandlerContextType,
  config: RouteDefinitionType,
): Promise<Response> | Response => {
  const local = ctx.localAddr as { hostname: string; port: number };

  const request = new HttpRequest(
    req,
    local.hostname,
    local.port,
    ctx.params,
  );

  const response = new HttpResponse(ctx);

  return config.handler.call(null, request, response);
};
