import { HttpRequest, HttpResponse, z } from "../deps.ts";
import { RouteConstraintsSchema, RouteDefinitionSchema } from "./schema.ts";

// export type RoutePathType = z.infer<typeof RouteDefinitionSchema.shape.path>;
export type RouteDefaultValuesType = z.infer<
  typeof RouteDefinitionSchema.shape.default
>;

export type RouteConstraintsType = z.infer<typeof RouteConstraintsSchema>;

export type RouteDefinitionType = {
  /**
   * Handler to trigger if this route matched
   */
  handler: (
    request: HttpRequest,
    response: HttpResponse,
  ) => Response | Promise<Response>;

  /**
   * Allowed methods for this route
   */
  methods?: z.infer<typeof RouteDefinitionSchema.shape.methods>;
  /**
   * Protocol type
   * @example https http
   */
  protocols?: z.infer<typeof RouteDefinitionSchema.shape.protocols>;
  /**
   * Allow hosts for this route
   * @example ["api.hypervit.io"]
   */
  hosts?: z.infer<typeof RouteDefinitionSchema.shape.hosts>;
  /**
   * Allow ips for this route
   * @example ["127.0.0.1"]
   */
  ips?: z.infer<typeof RouteDefinitionSchema.shape.ips>;
  /**
   * Port of route
   * @default 80
   * @example 8000
   */
  ports?: z.infer<typeof RouteDefinitionSchema.shape.ports>;
  /**
   * Constraints for route params
   * @example {id: /^[0-9]+$/}
   */
  constraints?: z.infer<typeof RouteDefinitionSchema.shape.constraints>;
  /**
   * Default values for route params
   */
  default?: RouteDefaultValuesType;
  /**
   * Additional data for this route
   */
  data?: z.infer<typeof RouteDefinitionSchema.shape.data>;
  /**
   * Allowed locales for this route
   */
  locales?: z.infer<typeof RouteDefinitionSchema.shape.locales>;
  /**
   * Allowed environment for this route
   * @example ["development"] ["production", "development"] ["testing", "local"]
   */
  envs?: z.infer<typeof RouteDefinitionSchema.shape.envs>;
  /**
   * Version of this route
   */
  versions?: z.infer<typeof RouteDefinitionSchema.shape.versions>;
  /**
   * Route description. Used for documentation
   */
  description?: z.infer<typeof RouteDefinitionSchema.shape.description>;
};
