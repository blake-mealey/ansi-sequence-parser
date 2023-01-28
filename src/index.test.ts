import { test, expect } from 'vitest';
import { createAnsiSequenceParser, parseAnsiSequences } from '.';

test('parses full value', () => {
  const tokens = parseAnsiSequences(`[0m [0;32m✓[0m [0;2msrc/[0mindex[0;2m.test.ts (1)[0m

  [0;2m Test Files [0m [0;1;32m1 passed[0;98m (1)[0m
  [0;2m      Tests [0m [0;1;32m1 passed[0;98m (1)[0m
  [0;2m   Start at [0m 23:32:41
  [0;2m   Duration [0m 11ms

  [42;1;39;0m PASS [0;32m Waiting for file changes...[0m
         [0;2mpress [0;1mh[0;2m to show help, press [0;1mq[0;2m to quit`);

  expect(tokens).toMatchInlineSnapshot(`
    [
      {
        "background": null,
        "decorations": Set {},
        "foreground": null,
        "value": " ",
      },
      {
        "background": null,
        "decorations": Set {},
        "foreground": {
          "name": "green",
          "type": "named",
        },
        "value": "✓",
      },
      {
        "background": null,
        "decorations": Set {},
        "foreground": null,
        "value": " ",
      },
      {
        "background": null,
        "decorations": Set {
          "dim",
        },
        "foreground": null,
        "value": "src/",
      },
      {
        "background": null,
        "decorations": Set {},
        "foreground": null,
        "value": "index",
      },
      {
        "background": null,
        "decorations": Set {
          "dim",
        },
        "foreground": null,
        "value": ".test.ts (1)",
      },
      {
        "background": null,
        "decorations": Set {},
        "foreground": null,
        "value": "

      ",
      },
      {
        "background": null,
        "decorations": Set {
          "dim",
        },
        "foreground": null,
        "value": " Test Files ",
      },
      {
        "background": null,
        "decorations": Set {},
        "foreground": null,
        "value": " ",
      },
      {
        "background": null,
        "decorations": Set {
          "bold",
        },
        "foreground": {
          "name": "green",
          "type": "named",
        },
        "value": "1 passed",
      },
      {
        "background": null,
        "decorations": Set {},
        "foreground": null,
        "value": " (1)",
      },
      {
        "background": null,
        "decorations": Set {},
        "foreground": null,
        "value": "
      ",
      },
      {
        "background": null,
        "decorations": Set {
          "dim",
        },
        "foreground": null,
        "value": "      Tests ",
      },
      {
        "background": null,
        "decorations": Set {},
        "foreground": null,
        "value": " ",
      },
      {
        "background": null,
        "decorations": Set {
          "bold",
        },
        "foreground": {
          "name": "green",
          "type": "named",
        },
        "value": "1 passed",
      },
      {
        "background": null,
        "decorations": Set {},
        "foreground": null,
        "value": " (1)",
      },
      {
        "background": null,
        "decorations": Set {},
        "foreground": null,
        "value": "
      ",
      },
      {
        "background": null,
        "decorations": Set {
          "dim",
        },
        "foreground": null,
        "value": "   Start at ",
      },
      {
        "background": null,
        "decorations": Set {},
        "foreground": null,
        "value": " 23:32:41
      ",
      },
      {
        "background": null,
        "decorations": Set {
          "dim",
        },
        "foreground": null,
        "value": "   Duration ",
      },
      {
        "background": null,
        "decorations": Set {},
        "foreground": null,
        "value": " 11ms

      ",
      },
      {
        "background": {
          "name": "green",
          "type": "named",
        },
        "decorations": Set {
          "bold",
        },
        "foreground": null,
        "value": " PASS ",
      },
      {
        "background": null,
        "decorations": Set {},
        "foreground": {
          "name": "green",
          "type": "named",
        },
        "value": " Waiting for file changes...",
      },
      {
        "background": null,
        "decorations": Set {},
        "foreground": null,
        "value": "
             ",
      },
      {
        "background": null,
        "decorations": Set {
          "dim",
        },
        "foreground": null,
        "value": "press ",
      },
      {
        "background": null,
        "decorations": Set {
          "bold",
        },
        "foreground": null,
        "value": "h",
      },
      {
        "background": null,
        "decorations": Set {
          "dim",
        },
        "foreground": null,
        "value": " to show help, press ",
      },
      {
        "background": null,
        "decorations": Set {
          "bold",
        },
        "foreground": null,
        "value": "q",
      },
      {
        "background": null,
        "decorations": Set {
          "dim",
        },
        "foreground": null,
        "value": " to quit",
      },
    ]
  `);
});

test('parses value by line', () => {
  const value = `[0;32msome green text
which wraps to the next line[0m
then clears after that`;

  const lines = value.split(/\r?\n/);
  const parser = createAnsiSequenceParser();

  const tokens = lines.map((line) => parser.parse(line));

  expect(tokens).toMatchInlineSnapshot(`
    [
      [
        {
          "background": null,
          "decorations": Set {},
          "foreground": {
            "name": "green",
            "type": "named",
          },
          "value": "some green text",
        },
      ],
      [
        {
          "background": null,
          "decorations": Set {},
          "foreground": {
            "name": "green",
            "type": "named",
          },
          "value": "which wraps to the next line",
        },
      ],
      [
        {
          "background": null,
          "decorations": Set {},
          "foreground": null,
          "value": "then clears after that",
        },
      ],
    ]
  `);
});

test('colors', () => {
  const value = `[0;32mGreen[0;90mBright Black[0;38;2;31;222;162mPastel Green[0;38;5;87mTable Cyan`;

  const lines = value.split(/\r?\n/);
  const parser = createAnsiSequenceParser();

  const tokens = lines.map((line) => parser.parse(line));

  expect(tokens).toMatchInlineSnapshot(`
    [
      [
        {
          "background": null,
          "decorations": Set {},
          "foreground": {
            "name": "green",
            "type": "named",
          },
          "value": "Green",
        },
        {
          "background": null,
          "decorations": Set {},
          "foreground": {
            "name": "brightBlack",
            "type": "named",
          },
          "value": "Bright Black",
        },
        {
          "background": null,
          "decorations": Set {},
          "foreground": {
            "rgb": [
              31,
              222,
              162,
            ],
            "type": "rgb",
          },
          "value": "Pastel Green",
        },
        {
          "background": null,
          "decorations": Set {},
          "foreground": {
            "index": 87,
            "type": "table",
          },
          "value": "Table Cyan",
        },
      ],
    ]
  `);
});
