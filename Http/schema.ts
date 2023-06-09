import { z } from "../Validation/mod.ts";

export const HttpMethodSchema = z.enum([
  "GET",
  "HEAD",
  "POST",
  "PUT",
  "DELETE",
  "OPTIONS",
  "PATCH",
]);

export const HttpProtocolSchema = z.enum([
  "https",
  "http",
  "socket",
  "tcp",
  "ftp",
]);

export const CharsetSchema = z.enum([
  "utf-8",
  "iso-8859-1",
  "us-ascii",
]).or(z.string());
