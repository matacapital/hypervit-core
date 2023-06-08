import { parse as parseYaml, stringify as stringifyYaml } from "./deps.ts";

export class Yaml {
  public static parse<T = Record<string, unknown>>(content: string): T {
    return parseYaml(content) as T;
  }

  public static stringify(content: Record<string, unknown>): string {
    return stringifyYaml(content);
  }
}
