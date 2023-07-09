import { AppEnvType } from "../App/types.ts";
import { HttpMethodType, LocaleType, VersionType } from "./deps.ts";

export type MatchedRouteParamsType = Record<
  string | number,
  string | number | undefined
>;

export type MatchedRouteType = {
  url: URL;
  params: MatchedRouteParamsType;
  method: HttpMethodType;
  ip: string;
  locale: LocaleType;
  env: AppEnvType;
  version: VersionType | null;
};
