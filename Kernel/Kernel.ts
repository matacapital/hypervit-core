import { ConfigException } from "../Config/ConfigException.ts";
import { loadAppConfig } from "../Config/loadAppConfig.ts";
import { ConfigSchema } from "../Config/schema.ts";
import { AppConfigType } from "../Config/types.ts";
import { Container, Keys } from "../Container/Container.ts";
import { loadEnv } from "../Env/loadEnv.ts";
import { File } from "../File/mod.ts";
import type { IFile } from "../File/types.ts";
import { loadHandlers } from "../Handler/loadHandlers.ts";
import { EnvHelper } from "../Http/deps.ts";

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

    // Copy files
    // TODO: Copy folders
    const filesToCopy = appConfig.copy ?? {};
    Object.keys(filesToCopy).forEach((file) => {
      const destination = "static/" + filesToCopy[file].replace(
        /\[hash\]/,
        EnvHelper.getHash(),
      );
      const to = new File(destination);
      if (!to.exists()) {
        const from = new File(file);
        from.cp(destination);
      }
    });

    const handlers = loadHandlers("handlers");

    return { handlers };
  }
}
