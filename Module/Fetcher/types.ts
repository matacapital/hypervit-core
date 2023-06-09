import { IHeaderChecker } from "./deps.ts";
export type HttpMethodType =
  | "CONNECT"
  | "DELETE"
  | "GET"
  | "HEAD"
  | "OPTIONS"
  | "PATCH"
  | "POST"
  | "PUT"
  | "TRACE";

export interface IFetcherResponse extends IHeaderChecker {
  getBody: <T = Record<string, unknown>>() => Promise<
    T | string | FormData | Blob | null
  >;
}
