import { Container } from "./deps.ts";
import { IException, StackType } from "./types.ts";

export class Exception extends Error implements IException {
  public readonly name: string;
  public readonly reason: string;
  public readonly stacks: StackType[];
  public readonly file: string | null;
  public readonly line: number | null;
  public readonly column: number | null;
  public readonly date: Date = new Date();
  public readonly id: string;

  // deno-lint-ignore constructor-super
  constructor(
    message: string | Error,
    public readonly status: number | null = null,
    public readonly data: Readonly<unknown> | null = null,
  ) {
    if (message instanceof Error) {
      super(crypto.randomUUID());
      this.name = message.constructor.name;
      this.reason = (message as Error).message;
    } else {
      super(crypto.randomUUID());
      this.name = this.constructor.name;
      this.reason = message;
    }

    this.stacks = this.parseStack(this.stack as string);

    this.id = this.message;

    this.file = this.stacks.length > 0 ? this.stacks[0].file : null;
    this.line = this.stacks.length > 0 ? this.stacks[0].line : null;
    this.column = this.stacks.length > 0 ? this.stacks[0].column : null;

    Container.add(this.id, this);
  }

  private parseStack(stack: string): StackType[] {
    const errorStack: StackType[] = [];
    const stacks = stack.split(/[\n\r]/) ?? [];

    stacks.map((stack) => {
      const match = stack.trim().match(/at (.+:(\d+):(\d+)\)?)/i);
      if (match) {
        const file = match[1].replace(`file://${Deno.cwd()}/`, "");
        errorStack.push({
          file: file.replace(`:${match[2]}:${match[3]}`, ""),
          line: parseInt(match[2]),
          column: parseInt(match[3]),
        });
      }
    });

    return errorStack;
  }
}
