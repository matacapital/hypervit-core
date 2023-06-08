import { loadAppConfig } from "../Config/loadAppConfig.ts";
import { loadControllers } from "../Controller/loadControllers.ts";
import { ConfigValidationException } from "./ConfigValidationException.ts";
import {
  ApiConfigSchema,
  App,
  AppType,
  AppTypeSchema,
  EnvHelper,
  EnvSchema,
  IFile,
  Keys,
  registerConstant,
  ViewConfigSchema,
  ZodError,
} from "./deps.ts";
import { EnvValidationException } from "./EnvValidationException.ts";
import { loadEnv } from "./loadEnv.ts";

type AppConfigType = {
  directories: Record<string, unknown>;
  type: AppType;
};

type BootReturnType = {
  controllers: IFile[];
};

export class Kernel {
  public static boot(): BootReturnType {
    // Load app config
    const config = loadAppConfig<AppConfigType>();

    const res = AppTypeSchema.safeParse(config.type);
    if (!res.success) {
      const error = res.error.issues[0];
      throw new ConfigValidationException(
        `${error.path.join(".")}: ${error.message}`,
      );
    }

    registerConstant(Keys.Config.App, config);
    registerConstant(Keys.App.Type, config.type);
    registerConstant(Keys.App.RootDir, config.directories.root);

    // Load env vars
    const env = loadEnv();

    const envData = env.toJson();
    const result = EnvSchema.safeParse(envData);

    if (!result.success) {
      const error = result.error.issues[0];

      throw new EnvValidationException(
        `${error.path.join(".")}: ${error.message}`,
      );
    }

    registerConstant(Keys.Env.Default, env);
    const envHelper = new EnvHelper();
    registerConstant(Keys.Env.Helper, envHelper);

    let configValidationError: null | ZodError = null;
    if (App.isApi()) {
      const result = ApiConfigSchema.safeParse(config);
      if (!result.success) {
        configValidationError = result.error;
      }
    }

    if (App.isView()) {
      const result = ViewConfigSchema.safeParse(config);
      if (!result.success) {
        configValidationError = result.error;
      }
    }

    if (configValidationError) {
      const error = configValidationError.issues[0];

      throw new ConfigValidationException(
        `${error.path.join(".")}: ${error.message}`,
      );
    }

    // Abort Controller
    registerConstant(Keys.AbortController, new AbortController());

    const controllers = loadControllers(
      config.directories.controllers as string,
    );

    return { controllers };
  }
}
