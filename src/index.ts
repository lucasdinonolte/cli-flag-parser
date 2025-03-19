import { object } from 'zod';

import type {
  ParseCliFlagsOpts,
  ParseCliFlagsResult,
  ParseCliFlagsSchema,
} from './types';

/**
 * Checks if a string is a CLI flag.
 */
const isFlag = (str: string): boolean =>
  str.startsWith('--') || (str.startsWith('-') && str.length === 2);

/**
 * Gets the name of a flag.
 */
const flagName = (str: string): string => str.replace(/^(-{1,2})(\S+)/, '$2');

/**
 * Creates a parser function that processes command-line interface
 * flags based on a given zod schema.
 */
export function createParser<TSchema extends ParseCliFlagsSchema>(
  _schema: TSchema,
  opts: ParseCliFlagsOpts = {},
): (argv: Array<string>) => ParseCliFlagsResult<TSchema> {
  return (argv) => {
    let current = 0;
    const res: Record<string, unknown> = {};

    const peek = (): string | undefined => argv[current];
    const next = (): string | undefined => argv[current++];
    const endOfInput = (): boolean => typeof peek() === 'undefined';

    while (!endOfInput()) {
      const token = next();

      if (!token) break;
      if (!isFlag(token)) continue;

      const nextToken = peek();

      if (!nextToken || isFlag(nextToken)) {
        const key = flagName(token);
        res[key] = true;
        continue;
      }

      const key = flagName(token);
      const value = next();
      res[key] = value;
    }

    const { strict = false, passthrough = false } = opts;

    if (strict && passthrough) {
      throw new Error('Cannot use strict and passthrough options together');
    }

    const fullSchema = object(_schema);
    const schema = strict
      ? fullSchema.strict()
      : passthrough
        ? fullSchema.passthrough()
        : fullSchema;

    const parsed = schema.safeParse(res);

    // TODO: Better error handling
    if (parsed.success === false) {
      const err = parsed.error.flatten();
      throw new Error(`Invalid CLI Flags: ${JSON.stringify(err, null, 2)}`);
    }

    return parsed.data;
  };
}
