import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { createParser } from '../src/index';

const schema = {
  verbose: z.boolean().optional(),
  output: z.string().optional(),
};

const shortSchema = {
  v: z.boolean().optional(),
  o: z.string().optional(),
};

describe('createParser', () => {
  it('should parse boolean flags correctly', () => {
    const parser = createParser(schema);
    const result = parser(['--verbose']);
    expect(result).toEqual({ verbose: true });
  });

  it('should parse value flags correctly', () => {
    const parser = createParser(schema);
    const result = parser(['--output', 'file.txt']);
    expect(result).toEqual({ output: 'file.txt' });
  });

  it('should parse mixed flags correctly', () => {
    const parser = createParser(schema);
    const result = parser(['--verbose', '--output', 'file.txt']);
    expect(result).toEqual({ verbose: true, output: 'file.txt' });
  });

  it('should ignore positional arguments', () => {
    const parser = createParser(schema);
    const result = parser([
      'build',
      'name',
      '--verbose',
      '--output',
      'file.txt',
    ]);
    expect(result).toEqual({ verbose: true, output: 'file.txt' });
  });

  it('should handle short flags correctly', () => {
    const parser = createParser(shortSchema);
    const result = parser(['-v', '-o', 'file.txt']);
    expect(result).toEqual({ v: true, o: 'file.txt' });
  });

  it('should handle unknown flags without strict mode', () => {
    const parser = createParser(schema);
    const result = parser(['--verbose', '--unknown', 'value']);
    expect(result).toEqual({ verbose: true });
  });

  it('should throw an error for unknown flags in strict mode', () => {
    const parser = createParser(schema, { strict: true });
    expect(() => parser(['--verbose', '--unknown', 'value'])).toThrow();
  });

  it('should allow passthrough of unknown flags', () => {
    const parser = createParser(schema, { passthrough: true });
    const result = parser(['--verbose', '--unknown', 'value']);
    expect(result).toEqual({ verbose: true, unknown: 'value' });
  });

  it('should throw an error if both strict and passthrough options are set', () => {
    const parser = createParser(schema, { strict: true, passthrough: true });
    expect(() => parser(['--verbose'])).toThrow(
      'Cannot use strict and passthrough options together',
    );
  });

  it('should throw an error for invalid flags', () => {
    const parser = createParser(schema);
    expect(() => parser(['--output'])).toThrow();
  });

  it('should return an empty object for no flags', () => {
    const parser = createParser(schema);
    const result = parser([]);
    expect(result).toEqual({});
  });
});
