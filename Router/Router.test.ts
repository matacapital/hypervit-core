import { assertEquals, describe, it } from "@testing";
import { generateUrl, Router, UrlGenerationException } from "./mod.ts";

describe("Router", () => {
  describe("generateUrl", () => {
    it("route not found exception", () => {
      try {
        generateUrl("notFound");
      } catch (e) {
        assertEquals(e instanceof UrlGenerationException, true);
      }
    });
    describe("route", () => {
      Router.addOrException("myRoute", {
        path: "/user/:id/edit/:name",
        handler: () => new Response("hey"),
      });

      it("without baseUrl", () => {
        try {
          generateUrl("myRoute");
        } catch (e) {
          assertEquals(e instanceof UrlGenerationException, true);
        }

        const path = generateUrl("myRoute", { id: 123, name: "hypervit" });
        assertEquals(path, "/user/123/edit/hypervit");
      });

      it("with baseUrl", () => {
        try {
          generateUrl("myRoute");
        } catch (e) {
          assertEquals(e instanceof UrlGenerationException, true);
        }

        const path = generateUrl(
          "myRoute",
          { id: 123, name: "hypervit" },
          new URL("https://api.hypervit.com:8000/"),
        );
        assertEquals(
          path,
          "https://api.hypervit.com:8000/user/123/edit/hypervit",
        );
      });
    });
  });
});
