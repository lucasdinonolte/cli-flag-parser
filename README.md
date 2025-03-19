# CLI Flag Parser

A simple utility for making parsing command-line flags type-safe using zod.

## Features

- Parses boolean and value flags
- Supports strict and passthrough modes for flag validation
- Integration with Zod for full type-safety

## Installation

To get started, clone the repository and install the dependencies:

```bash
npm install @lucasdinonolte/cli-flag-parser
```

## Usage

### Example

Here’s a basic example of how to use the CLI flag parser:

```typescript
import { createParser } from '@lucasdinonolte/cli-flag-parser';
import { z } from 'zod';

const parser = createParser({
  verbose: z.boolean().default(false),
  output: z.string(),
});

const result = parser(process.argv.slice(2));
```
