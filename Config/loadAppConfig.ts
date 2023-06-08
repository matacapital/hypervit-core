import { ConfigException } from "./ConfigException.ts";
import { File, Yaml } from "./deps.ts";

export const loadAppConfig = <T>(): T => {
  const file = new File("config/app/app.yml");
  if (!file.exists()) {
    throw new ConfigException(`File "${file.getPath()}" not found`);
  }

  return Yaml.parse(file.read());
};
