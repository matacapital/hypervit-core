import { AbstractPrompt } from "./AbstractPrompt.ts";
import { Input } from "./deps.ts";
import { InputPromptType } from "./types.ts";

export class InputPrompt extends AbstractPrompt {
  public options: InputPromptType;

  constructor(message: string) {
    super(message);
    this.options = { message };
  }

  public min(length?: number): this {
    this.options.minLength = length;

    return this;
  }

  public max(length?: number): this {
    this.options.maxLength = length;

    return this;
  }

  public defaultValue(value?: string): this {
    this.options.default = value;

    return this;
  }

  public async prompt(): Promise<string> {
    return await Input.prompt(this.options);
  }
}
