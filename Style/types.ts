export type ModifierType =
  | "reset"
  | "bold"
  | "dim"
  | "italic"
  | "underline"
  | "inverse"
  | "hidden"
  | "strikethrough";
export type ColorType =
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white"
  | "gray";

/**
 * Style interface
 * This interface allows you to style terminal output.
 */
export interface IStyle {
  /**
   * Renders styled text.
   *
   * @param text - Text to style.
   * @returns The styled text.
   */
  render: (text: string) => string;

  /**
   * Reset style.
   */
  reset: () => IStyle;

  /**
   * Bold.
   */
  bold: () => IStyle;

  /**
   * Dim.
   */
  dim: () => IStyle;

  /**
   * Italic.
   */
  italic: () => IStyle;

  /**
   * Underline.
   */
  underline: () => IStyle;

  /**
   * Inverse.
   */
  inverse: () => IStyle;

  /**
   * Hidden.
   */
  hidden: () => IStyle;

  /**
   * Strike through.
   */
  strikethrough: () => IStyle;

  /**
   * Applies text color.
   *
   * @param color - Color of text.
   */
  color: (color: ColorType | null) => IStyle;

  /**
   * Set or remove light color
   */
  light: (isLight: boolean) => IStyle;

  /**
   * Applies text background color.
   *
   * @param color - Background color of text.
   */
  bgc: (color: ColorType | null) => IStyle;

  /**
   * Set or remove light background color
   */
  lightBg: (isLight: boolean) => IStyle;
}
