import { FetcherResponse } from "./FetcherResponse.ts";
import { Header } from "./deps.ts";
import { HttpMethodType } from "./types.ts";

export class Fetcher {
  private cache: RequestCache | null = null;
  private credentials: RequestCredentials | null = null;
  public readonly header: Header = new Header();
  private integrity: string | null = null;
  private keepalive: boolean | null = null;
  private method: HttpMethodType = "GET";
  private mode: RequestMode | null = null;
  private redirect: RequestRedirect | null = null;
  private referrer: string | null = null;
  private referrerPolicy: ReferrerPolicy | null = null;
  private signal: AbortController = new AbortController();

  constructor(private baseUrl: string | null) {
  }

  public abort(): this {
    this.signal.abort();

    return this;
  }

  public async Trace(
    path: string,
    data?: BodyInit | null,
  ): Promise<FetcherResponse> {
    this.method = "TRACE";

    return await this.send(path, data);
  }

  public async Put(
    path: string,
    data?: BodyInit | null,
  ): Promise<FetcherResponse> {
    this.method = "PUT";

    return await this.send(path, data);
  }

  public async Post(
    path: string,
    data?: BodyInit | null,
  ): Promise<FetcherResponse> {
    this.method = "POST";

    return await this.send(path, data);
  }

  public async Patch(
    path: string,
    data?: BodyInit | null,
  ): Promise<FetcherResponse> {
    this.method = "PATCH";

    return await this.send(path, data);
  }

  public async Options(
    path: string,
    data?: BodyInit | null,
  ): Promise<FetcherResponse> {
    this.method = "OPTIONS";

    return await this.send(path, data);
  }

  public async Delete(
    path: string,
    data?: BodyInit | null,
  ): Promise<FetcherResponse> {
    this.method = "DELETE";

    return await this.send(path, data);
  }

  public async Connect(
    path: string,
    data?: BodyInit | null,
  ): Promise<FetcherResponse> {
    this.method = "CONNECT";

    return await this.send(path, data);
  }

  public async Get(
    path: string,
  ): Promise<FetcherResponse> {
    this.method = "GET";

    return await this.send(path);
  }

  public async Head(
    path: string,
  ): Promise<FetcherResponse> {
    this.method = "HEAD";

    return await this.send(path);
  }

  public async sendFormData(
    path: string,
    data: FormData,
  ): Promise<FetcherResponse> {
    this.method = "POST";
    this.header.formData();

    return await this.send(path, data);
  }

  public async sendJson(
    path: string,
    data: Record<string | number, unknown>,
  ): Promise<FetcherResponse> {
    this.method = "POST";
    this.header.json();

    return await this.send(path, JSON.stringify(data));
  }

  public async send(
    path: string,
    data?: BodyInit | null,
  ): Promise<FetcherResponse> {
    const url = new URL(path, this.baseUrl ?? undefined);
    const request = new Request(url, {
      body: (this.method === "GET" || this.method === "HEAD")
        ? undefined
        : data,
      cache: this.cache ?? undefined,
      credentials: this.credentials ?? undefined,
      headers: this.header.native,
      integrity: this.integrity ?? undefined,
      keepalive: this.keepalive ?? undefined,
      method: this.method ?? undefined,
      mode: this.mode ?? undefined,
      redirect: this.redirect ?? undefined,
      referrer: this.referrer ?? undefined,
      referrerPolicy: this.referrerPolicy ?? undefined,
      signal: this.signal.signal,
    });

    const response = await fetch(request);

    return new FetcherResponse(response);
  }

  public setBaseUrl(baseUrl: string | null): this {
    this.baseUrl = baseUrl;

    return this;
  }

  public getBaseUrl(): string | null {
    return this.baseUrl;
  }

  public setMethod(method: HttpMethodType): this {
    this.method = method;

    return this;
  }

  public getMethod(): HttpMethodType {
    return this.method;
  }

  public setCache(cache: RequestCache | null): this {
    this.cache = cache;

    return this;
  }

  public getCache(): RequestCache | null {
    return this.cache;
  }

  public setCredentials(credentials: RequestCredentials | null): this {
    this.credentials = credentials;

    return this;
  }

  public getCredentials(): RequestCredentials | null {
    return this.credentials;
  }

  public setIntegrity(integrity: string | null): this {
    this.integrity = integrity;

    return this;
  }

  public getIntegrity(): string | null {
    return this.integrity;
  }

  public setKeepalive(keepalive: boolean | null): this {
    this.keepalive = keepalive;

    return this;
  }

  public getKeepalive(): boolean | null {
    return this.keepalive;
  }

  public setMode(mode: RequestMode | null): this {
    this.mode = mode;

    return this;
  }

  public getMode(): RequestMode | null {
    return this.mode;
  }

  public setRedirect(redirect: RequestRedirect | null): this {
    this.redirect = redirect;

    return this;
  }
  public getRedirect(): RequestRedirect | null {
    return this.redirect;
  }

  public setReferrer(referrer: string | null): this {
    this.referrer = referrer;

    return this;
  }

  public getReferrer(): string | null {
    return this.referrer;
  }

  public setReferrerPolicy(referrerPolicy: ReferrerPolicy | null): this {
    this.referrerPolicy = referrerPolicy;

    return this;
  }

  public getReferrerPolicy(): ReferrerPolicy | null {
    return this.referrerPolicy;
  }

  public setSignal(signal: AbortController): this {
    this.signal = signal;

    return this;
  }

  public getSignal(): AbortController {
    return this.signal;
  }
}
