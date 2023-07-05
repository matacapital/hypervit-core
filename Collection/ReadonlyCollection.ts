import { Helper } from "./deps.ts";
import {
  CallbackFnType,
  CollectionKeyType,
  IReadonlyCollection,
} from "./types.ts";

export class ReadonlyCollection<
  K extends CollectionKeyType = string,
  V = unknown,
> extends Map implements IReadonlyCollection<K, V> {
  public count(): number {
    return this.size;
  }

  public isEmpty(): boolean {
    return this.count() === 0;
  }

  public search(search: RegExp): IReadonlyCollection<K, V> {
    const result = new ReadonlyCollection<K, V>();

    for (const [key, value] of this) {
      if (!Helper.isString(key)) {
        return result;
      }

      if (search.test(key as string)) {
        result.set(key, value);
      }
    }

    return result;
  }

  public filter(callbackFn: CallbackFnType<K, V>): IReadonlyCollection<K, V> {
    const result = new ReadonlyCollection<K, V>();

    for (const [key, value] of this) {
      if (callbackFn(value, key, this)) {
        result.set(key, value);
      }
    }

    return result;
  }

  public find(
    callbackFn: CallbackFnType<K, V>,
  ): IReadonlyCollection<K, V> | null {
    const result = new ReadonlyCollection<K, V>();

    for (const [key, value] of this) {
      if (callbackFn(value, key, this)) {
        result.set(key, value);

        return result;
      }
    }

    return null;
  }

  public first(): IReadonlyCollection<K, V> | null {
    const result = new ReadonlyCollection<K, V>();

    for (const [key, value] of this) {
      result.set(key, value);
      return result;
    }

    return null;
  }

  public toJson(): { [K in CollectionKeyType]: V } {
    const result: { [K in CollectionKeyType]: V } = {};

    for (const [key, value] of this) {
      if (!Helper.isString(key)) {
        return result;
      }

      result[key] = value;
    }

    return result;
  }

  public setData(data: { [K in CollectionKeyType]: V }): this {
    Object.keys(data).forEach((datum) => this.set(datum, data[datum]));

    return this;
  }
}
