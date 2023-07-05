import { ConfigException } from "../Config/ConfigException.ts";
import { loadAppConfig } from "../Config/loadAppConfig.ts";
import { ConfigSchema } from "../Config/schema.ts";
import { AppConfigType } from "../Config/types.ts";
import { Container, Keys } from "../Container/Container.ts";
import { loadEnv } from "../Env/loadEnv.ts";
import type { IFile } from "../File/types.ts";
import { loadHandlers } from "../Handler/loadHandlers.ts";

type BootReturnType = {
  handlers: IFile[];
};

export class Kernel {
  public static boot(): BootReturnType {
    const env = loadEnv();
    Container.add(Keys.Env.Default, env);

    const appConfig: AppConfigType = loadAppConfig();
    const result = ConfigSchema.safeParse(appConfig);

    if (!result.success) {
      const error = result.error.issues[0];

      throw new ConfigException(
        `${error.path.join(".")}: ${error.message}`,
      );
    }

    Container.add(Keys.Config.App, appConfig);

    const handlers = loadHandlers("handlers");

    return { handlers };
  }
}
