import { assertEquals, describe, it } from "@testing";
import { ConfirmPrompt } from "./mod.ts";

// TODO: mock all methods

describe("Prompt", () => {
  describe("ConfirmPrompt", () => {
    const confirmPrompt = new ConfirmPrompt("Continue?");

    it("message", () => {
      assertEquals(confirmPrompt.options.message, "Continue?");
    });
  });
});
