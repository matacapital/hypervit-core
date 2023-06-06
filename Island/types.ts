import { JSX } from "./deps.ts";

export type ViteOptionsModeType = "development" | "production";

export type LocalConfigType = {
  directories: {
    islands: string;
    public: string;
    var: string;
  };
};

export type GetIslandReturnType = { id: string; name: string; date: number };

export type IslandPropsType = {
  name: string;
  children?: JSX.Element;
} & Record<string, unknown>;

export type ManifestType = {
  assets?: string[];
  css?: string[];
  file: string;
  imports?: string[];
  isEntry?: boolean;
  src: string;
};
