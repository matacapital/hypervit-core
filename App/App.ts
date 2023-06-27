import { AppType } from "./types.ts";

export class App {
  public static getType(): AppType {
    return "view";
  }

  public static getRootDir(): string {
    return ".";
  }

  public static isApi(): boolean {
    return App.getType() === "api";
  }

  public static isView(): boolean {
    return App.getType() === "view";
  }
}
