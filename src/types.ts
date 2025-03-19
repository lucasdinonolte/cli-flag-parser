import type { TypeOf, ZodObject, ZodType } from 'zod';

export type ParseCliFlagsSchema = Record<string, ZodType>;

export type ParseCliFlagsOpts = {
  strict?: boolean;
  passthrough?: boolean;
};

export type ParseCliFlagsResult<TSchema extends ParseCliFlagsSchema> = Readonly<
  TypeOf<ZodObject<TSchema>>
>;
