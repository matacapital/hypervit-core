import { Collection } from "@collection";
import { ControllerType } from "@controller";
import { Request, Response as HttpResponse } from "@http";
import { get, Keys, registerConstant } from "@ioc";
import { Router } from "@routing";
import { assertInstanceOf, assertNotEquals } from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import { Route as HttpRoute } from "../mod.ts";
import { Route } from "./mod.ts";

const req = new Request();

const K = {
  Response: Symbol.for(`response-${crypto.randomUUID()}`),
  Route: {
    Default: Symbol.for(`route-default-${crypto.randomUUID()}`),
    Params: Symbol.for(`route-params-${crypto.randomUUID()}`),
  },
  Exception: Symbol.for(`exception-${crypto.randomUUID()}`),
};
registerConstant(req.id, K);

const response = new HttpResponse();
registerConstant(K.Response, response);

class Controller {
  @Route("index", "/")
  public index(_request: Request, response: HttpResponse): Response {
    return response.json({ message: "hi" });
  }
}

describe("Routing", () => {
  describe("Route", () => {
    describe("Decorator", () => {
      new Controller();
      const routes = get<Collection<string, HttpRoute>>(Keys.Routes);
      const router = new Router(routes);

      it("register route", () => {
        assertNotEquals(routes, null);
      });

      it("get route", () => {
        const route = router.findByName("index");
        assertNotEquals(route, null);

        const controller = route?.getController() as ControllerType;
        const response = controller(req);

        assertInstanceOf(response, Response);
      });
    });
  });
});