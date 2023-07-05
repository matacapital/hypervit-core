// deno-lint-ignore-file no-explicit-any

export type CollectionKeyType = string | number | symbol;

export interface IReadonlyCollection<
  K extends CollectionKeyType = string,
  V = unknown,
> extends ReadonlyMap<K, V> {
  get: <U = V>(key: K) => U | undefined;
  has: (key: K) => boolean;
  isEmpty: () => boolean;
  count: () => number;
  forEach: (callbackFn: ForEachCallbackFnType<K, V>, thisArg?: any) => void;
  keys: () => IterableIterator<K>;
  values: () => IterableIterator<V>;
  entries: () => IterableIterator<[K, V]>;
  /**
   * Get all data from the collection. Only for collections with string key
   */
  toJson: () => { [K in CollectionKeyType]: V };
  /**
   * Creates a new collection with all the elements that have their key that matches the RegExp. Only for collections with string key
   */
  search: (search: RegExp) => IReadonlyCollection<K, V>;
  /**
   * Creates a new collection with all elements that pass the test implemented by the provided function
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/filter
   */
  filter: (callbackFn: CallbackFnType<K, V>) => IReadonlyCollection<K, V>;
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/find
   */
  find: (callbackFn: CallbackFnType<K, V>) => IReadonlyCollection<K, V> | null;
  first: () => IReadonlyCollection<K, V> | null;
}

export interface ICollection<K extends CollectionKeyType = string, V = unknown>
  extends Map<K, V> {
  get: <U = V>(key: K) => U | undefined;
  has: (key: K) => boolean;
  isEmpty: () => boolean;
  count: () => number;
  forEach: (callbackFn: ForEachCallbackFnType<K, V>, thisArg?: any) => void;
  keys: () => IterableIterator<K>;
  values: () => IterableIterator<V>;
  entries: () => IterableIterator<[K, V]>;
  /**
   * Get all data from the collection. Only for collections with string key
   */
  toJson: () => { [K in CollectionKeyType]: V };
  /**
   * Creates a new collection with all the elements that have their key that matches the RegExp. Only for collections with string key
   */
  search: (search: RegExp) => ICollection<K, V>;
  /**
   * Creates a new collection with all elements that pass the test implemented by the provided function
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/filter
   */
  filter: (callbackFn: CallbackFnType<K, V>) => ICollection<K, V>;

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/find
   */
  find: (callbackFn: CallbackFnType<K, V>) => ICollection<K, V> | null;
  first: () => ICollection<K, V> | null;
}

export type ForEachCallbackFnType<K, V> = (
  value: V,
  key: K,
  map: Map<K, V>,
) => void;

export type CallbackFnType<K, V> = (
  value: V,
  key: K,
  map: Map<K, V>,
) => boolean;
