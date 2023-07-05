import { IReadonlyCollection, ReadonlyCollection } from "../deps.ts";
import { HeaderChecker } from "../Header/HeaderChecker.ts";
import { ReadonlyHeader } from "../Header/ReadonlyHeader.ts";
import { HttpMethodType } from "../types.ts";
import { RequestBodyParserException } from "./RequestBodyParserException.ts";
import { IRequest } from "./types.ts";

export class HttpRequest extends HeaderChecker implements IRequest {
  public readonly url: Readonly<URL>;
  public readonly header: ReadonlyHeader;
  public readonly method: HttpMethodType;
  public readonly searchParams: IReadonlyCollection;
  public readonly params: IReadonlyCollection;

  constructor(
    public readonly native: Request,
    public readonly hostname: string,
    public readonly port: number,
    params: Record<string, string>,
  ) {
    super(native.headers);

    this.url = new URL(native.url);
    this.header = new ReadonlyHeader(native.headers);
    const searchParams = new ReadonlyCollection();
    for (const [key, value] of this.url.searchParams) {
      searchParams.set(key, value);
    }
    this.searchParams = searchParams;
    this.method = native.method as HttpMethodType;

    const paramsCollection = new ReadonlyCollection();
    paramsCollection.setData(params);
    this.params = paramsCollection;
  }

  // TODO: arrayBuffer()
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
