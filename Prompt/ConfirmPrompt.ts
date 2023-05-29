import { AbstractPrompt } from "./AbstractPrompt.ts";
import { Confirm } from "./deps.ts";
import { ConfirmPromptType } from "./types.ts";

export class ConfirmPrompt extends AbstractPrompt {
  public options: ConfirmPromptType;

  constructor(message: string) {
    super(message);
    this.options = { message };
  }

  public async prompt(): Promise<boolean> {
    return await Confirm.prompt(this.options);
  }
}
