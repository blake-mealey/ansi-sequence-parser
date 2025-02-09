import { test, expect } from 'vitest';
import chalk, { ChalkInstance } from 'chalk';
import { parseAnsiSequences, ParseToken } from './parser';
import { ColorName, namedColors } from './colors';

function namedColorToChalkFunction(
  name: ColorName,
  background?: boolean
): ChalkInstance {
  let funcName: string;
  if (name.startsWith('bright')) {
    const color = name.substring('bright'.length).toLowerCase();
    funcName = color + 'Bright';
  } else {
    funcName = name;
  }

  if (background) {
    funcName = 'bg' + funcName.charAt(0).toUpperCase() + funcName.substring(1);
  }

  return chalk[funcName];
}

test.each(namedColors)(
  'should parse chalk named foreground color %s',
  (name) => {
    const chalkFunc = namedColorToChalkFunction(name);
    const result = parseAnsiSequences('one ' + chalkFunc('two') + ' three');
    expect(result).toEqual([
      {
        foreground: null,
        background: null,
        decorations: new Set(),
        value: 'one ',
      },
      {
        foreground: { type: 'named', name },
        background: null,
        decorations: new Set(),
        value: 'two',
      },
      {
        foreground: null,
        background: null,
        decorations: new Set(),
        value: ' three',
      },
    ] satisfies ParseToken[]);
  }
);

test.each(namedColors)(
  'should parse chalk named background color %s',
  (name) => {
    const chalkFunc = namedColorToChalkFunction(name, true);
    const result = parseAnsiSequences('one ' + chalkFunc('two') + ' three');
    expect(result).toEqual([
      {
        foreground: null,
        background: null,
        decorations: new Set(),
        value: 'one ',
      },
      {
        foreground: null,
        background: { type: 'named', name },
        decorations: new Set(),
        value: 'two',
      },
      {
        foreground: null,
        background: null,
        decorations: new Set(),
        value: ' three',
      },
    ] satisfies ParseToken[]);
  }
);

test.each(Array.from({ length: 256 }).map((_, i) => i))(
  'should parse chalk ansi256 foreground color %d',
  (index) => {
    const result = parseAnsiSequences(
      'one ' + chalk.ansi256(index)('two') + ' three'
    );
    expect(result).toEqual([
      {
        foreground: null,
        background: null,
        decorations: new Set(),
        value: 'one ',
      },
      {
        foreground: { type: 'table', index },
        background: null,
        decorations: new Set(),
        value: 'two',
      },
      {
        foreground: null,
        background: null,
        decorations: new Set(),
        value: ' three',
      },
    ] satisfies ParseToken[]);
  }
);

test.each(Array.from({ length: 256 }).map((_, i) => i))(
  'should parse chalk ansi256 background color %d',
  (index) => {
    const result = parseAnsiSequences(
      'one ' + chalk.bgAnsi256(index)('two') + ' three'
    );
    expect(result).toEqual([
      {
        foreground: null,
        background: null,
        decorations: new Set(),
        value: 'one ',
      },
      {
        foreground: null,
        background: { type: 'table', index },
        decorations: new Set(),
        value: 'two',
      },
      {
        foreground: null,
        background: null,
        decorations: new Set(),
        value: ' three',
      },
    ] satisfies ParseToken[]);
  }
);

test.each(Array.from({ length: 256 }).map((_, i) => i))(
  'should parse chalk rgb foreground color (random iteration %d)',
  () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    const result = parseAnsiSequences(
      'one ' + chalk.rgb(r, g, b)('two') + ' three'
    );
    expect(result).toEqual([
      {
        foreground: null,
        background: null,
        decorations: new Set(),
        value: 'one ',
      },
      {
        foreground: { type: 'rgb', rgb: [r, g, b] },
        background: null,
        decorations: new Set(),
        value: 'two',
      },
      {
        foreground: null,
        background: null,
        decorations: new Set(),
        value: ' three',
      },
    ] satisfies ParseToken[]);
  }
);

test.each(Array.from({ length: 256 }).map((_, i) => i))(
  'should parse chalk rgb background color (random iteration %d)',
  () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    const result = parseAnsiSequences(
      'one ' + chalk.bgRgb(r, g, b)('two') + ' three'
    );
    expect(result).toEqual([
      {
        foreground: null,
        background: null,
        decorations: new Set(),
        value: 'one ',
      },
      {
        foreground: null,
        background: { type: 'rgb', rgb: [r, g, b] },
        decorations: new Set(),
        value: 'two',
      },
      {
        foreground: null,
        background: null,
        decorations: new Set(),
        value: ' three',
      },
    ] satisfies ParseToken[]);
  }
);

test.each([
  ['bold', chalk.bold],
  ['dim', chalk.dim],
  ['italic', chalk.italic],
  ['underline', chalk.underline],
  ['reverse', chalk.inverse],
  ['hidden', chalk.hidden],
  ['strikethrough', chalk.strikethrough],
  ['overline', chalk.overline],
] as const)('should parse chalk %s decoration', (decoration, chalkFunc) => {
  const result = parseAnsiSequences('one ' + chalkFunc('two') + ' three');
  expect(result).toEqual([
    {
      foreground: null,
      background: null,
      decorations: new Set(),
      value: 'one ',
    },
    {
      foreground: null,
      background: null,
      decorations: new Set([decoration]),
      value: 'two',
    },
    {
      foreground: null,
      background: null,
      decorations: new Set(),
      value: ' three',
    },
  ] satisfies ParseToken[]);
});
