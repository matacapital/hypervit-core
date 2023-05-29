import { assertEquals } from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import { Route } from "../mod.ts";
import routeDefinition from "./example_route.ts";
import { RouteDefinitionSchema } from "./schema.ts";

describe("Route", () => {
  it("Should handle default values", () => {
    const routeConfig = {
      name: "route_name",
      path: "/products",
      controller: (): Response => new Response(),
    };

    RouteDefinitionSchema.parse(routeConfig);

    const route = new Route(routeConfig);
    assertEquals(route.getProtocols(), null);
    assertEquals(route.getHosts(), null);
    assertEquals(route.getIps(), null);
    assertEquals(route.getPorts(), null);
    assertEquals(route.getDefault(), {});
    assertEquals(route.getMethods(), null);
    assertEquals(route.getData(), null);
    assertEquals(route.getLocales(), null);
    assertEquals(route.getEnvs(), null);
    assertEquals(route.getVersions(), null);
    assertEquals(route.getDescription(), null);
  });

  it("Should handle route definition", () => {
    RouteDefinitionSchema.parse(routeDefinition);

    const route = new Route(routeDefinition);

    assertEquals(route.getPath(), "/products/:id/:name");
    assertEquals(route.getProtocols(), ["https", "http"]);
    assertEquals(route.getHosts(), ["api.hypervit.io", "hypervit.io"]);
    assertEquals(route.getIps(), ["127.0.0.1"]);
    assertEquals(route.getPorts(), [80, 8000]);
    assertEquals(route.getDefault(), {
      id: "58806cc0-f564-45ea-8266-198967a08503",
      name: "Doe",
    });
    assertEquals(route.getMethods(), ["GET", "POST"]);
    assertEquals(route.getData(), {
      color: "red",
      size: 42,
    });
    assertEquals(route.getLocales(), ["fr", "en"]);
    assertEquals(route.getEnvs(), ["development", "testing", "production"]);
    assertEquals(route.getVersions(), ["1.2.3", "2.0.0"]);
    assertEquals(route.getDescription(), "Route description");

    const constraints = route.getConstraints();
    assertEquals(constraints?.where, { price: 30, name: "keyboard" });
    assertEquals(constraints?.regex, {
      price: /^[0-9]+$/,
      name: /^[a-z0-9]+$/,
    });
    assertEquals(constraints?.number, ["part"]);
    assertEquals(constraints?.alphaNumeric, ["code"]);
    assertEquals(constraints?.in, { name: ["Doe", "Obama"] });
  });
});
