import { DotEnvValueType } from "../deps.ts";
import { AppLocaleType, AppVersionType } from "../types.ts";

export type AppEnvVarsType = Record<
  | "API"
  | "APP_ENV"
  | "COUNTRY"
  | "DEBUG"
  | "HOST"
  | "LOCALE"
  | "PORT"
  | "SECRET"
  | "SSL"
  | "VERSION"
  | `${Uppercase<string>}`,
  DotEnvValueType
>;

export type AppEnvType =
  | "dev"
  | "prod"
  | "test"
  | string;

export interface IEnv {
  getAppEnv(): AppEnvType;

  isApi(): boolean;

  isFullApp(): boolean;

  isDev(): boolean;

  isProd(): boolean;

  isTest(): boolean;

  getLocale(): AppLocaleType;

  getCountry(): string | null;

  getVersion(): AppVersionType | null;

  getSecret(): string | null;

  isDebug(): boolean;

  getSsl(): string | false;

  isSsl(): boolean;

  getPort(): number | null;

  getHost(): string | null;

  get<T>(key: Uppercase<string>): T | undefined;

  getData(): Record<string, DotEnvValueType>;
}
