import { AppEnvType, LocaleType, VersionType } from "./deps.ts";

export class EnvHelper {
  public static getHash(): string {
    return Deno.env.get("HASH") as string;
  }

  public static getAppEnv(): AppEnvType {
    return Deno.env.get("APP_ENV") as AppEnvType;
  }

  public static isDevelopment(): boolean {
    return EnvHelper.getAppEnv() === "development";
  }

  public static isLocal(): boolean {
    return EnvHelper.getAppEnv() === "local";
  }

  public static isProduction(): boolean {
    return EnvHelper.getAppEnv() === "production";
  }

  public static isTesting(): boolean {
    return EnvHelper.getAppEnv() === "testing";
  }

  public static isStaging(): boolean {
    return EnvHelper.getAppEnv() === "staging";
  }

  public static getLocale(): LocaleType {
    return Deno.env.get("LOCALE") as LocaleType;
  }

  public static getCountry(): string | null {
    return Deno.env.get("COUNTRY") ?? null;
  }

  public static getVersion(): VersionType {
    return Deno.env.get("VERSION") as VersionType;
  }

  public static getSecret(): string {
    return Deno.env.get("SECRET") as string;
  }

  public static isDebug(): boolean {
    // @ts-ignore: trust me
    return Deno.env.get("DEBUG");
  }

  public static getPort(): number {
    // @ts-ignore: trust me
    return Deno.env.get("PORT") as number;
  }

  public static getHost(): string {
    return Deno.env.get("HOST") as string;
  }

  public static getCharset(): string {
    return Deno.env.get("CHARSET") as string;
  }

  public static getTlsKey(): string | null {
    return Deno.env.get("TLS_KEY") ?? null;
  }

  public static getTlsCert(): string | null {
    return Deno.env.get("TLS_CERT") ?? null;
  }

  public static isSecure(): boolean {
    return !!this.getTlsKey() && !!this.getTlsCert();
  }
}
