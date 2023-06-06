import { assertEquals } from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import { colors } from "./deps.ts";
import { Style } from "./mod.ts";

describe("Style", () => {
  const style = new Style();

  it("modifiers", () => {
    assertEquals(colors.bold("hello"), style.reset().bold().render("hello"));

    style.reset().strikethrough().hidden().inverse().underline()
      .italic().dim()
      .bold();
    assertEquals(
      colors.bold(
        colors.dim(
          colors.italic(
            colors.underline(
              colors.inverse(colors.hidden(colors.strikethrough("hello"))),
            ),
          ),
        ),
      ),
      style.render("hello"),
    );
  });

  it("normal color", () => {
    style.reset();
    assertEquals(colors.blue("hello"), style.color("blue").render("hello"));
  });

  it("light color", () => {
    style.reset();
    assertEquals(colors.blue("hello"), style.color("blue").render("hello"));
  });

  it("normal background color", () => {
    style.reset();
    assertEquals(colors.bgWhite("hello"), style.bgc("white").render("hello"));
  });

  it("light background color", () => {
    style.reset();
    assertEquals(
      colors.bgBrightWhite("hello"),
      style.bgc("white").lightBg().render("hello"),
    );
  });

  it("reset style", () => {
    assertEquals("hello", style.reset().render("hello"));
  });
});
