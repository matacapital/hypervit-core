import { ConfigException } from "./ConfigException.ts";

export const parseConfig = async (): Promise<unknown> => {
  try {
    const config = await import(
      `${Deno.env.get("ROOT_DIR")}/config/app/app.config.ts`
    );

    return config.default;
  } catch (e) {
    throw new ConfigException(`Cannot import app config`, null, {
      file: "config/app/app.config.ts",
      message: `${e.message}`,
    });
  }
};