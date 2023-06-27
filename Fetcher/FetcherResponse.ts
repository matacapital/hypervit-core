import { RequestBodyParserException } from "./RequestBodyParserException.ts";
import { HeaderChecker, ReadonlyHeader } from "./deps.ts";
import { IFetcherResponse } from "./types.ts";

// TODO: isOk, getStatus
// TODO: add some events -> see Response object
export class FetcherResponse extends HeaderChecker implements IFetcherResponse {
  public readonly header: ReadonlyHeader | null;

  constructor(public readonly native: Response | null = null) {
    const headers = native ? native.headers : new Headers();
    super(headers);

    this.header = new ReadonlyHeader(headers);
  }

  public async getBody<T = Record<string, unknown>>(): Promise<
    T | string | FormData | Blob | null
  > {
    if (!this.native || !this.native.body || this.native.bodyUsed) {
      return null;
    }

    try {
      if (this.native && this.isJson()) {
        return await this.native.json();
      }

      if (this.native && this.isText()) {
        return await this.native.text();
      }

      if (this.native && this.isFormData()) {
        return await this.native.formData();
      }

      if (this.native && this.isBlob()) {
        return await this.native.blob();
      }
    } catch (e) {
      throw new RequestBodyParserException(e.message);
    }

    return null;
  }
}
