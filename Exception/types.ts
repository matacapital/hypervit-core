export interface IException {
  readonly name: string;
  readonly message: string;
  readonly stacks: StackType[];
  readonly file: string | null;
  readonly line: number | null;
  readonly column: number | null;
  readonly status: number | null;
  readonly date: Date;
  readonly data: Readonly<Record<string, unknown>>;
}

export type StackType = {
  file: string;
  line: number;
  column: number;
};
