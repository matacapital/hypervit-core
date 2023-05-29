import { AbstractPrompt } from "./AbstractPrompt.ts";
import { Toggle, ToggleOptions } from "./deps.ts";
import { InputPromptType } from "./types.ts";

export class TogglePrompt extends AbstractPrompt {
  public options: InputPromptType;

  constructor(message: string) {
    super(message);
    this.options = { message };
  }

  public async prompt(): Promise<boolean> {
    return await Toggle.prompt(this.options as ToggleOptions);
  }
}
