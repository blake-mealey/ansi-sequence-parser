import { test, expect } from 'vitest';
import {
  createAnsiSequenceParser,
  parseAnsiSequences,
  createColorPalette,
} from '.';

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

test('parser maintains state across calls', () => {
  const value = `[0;32msome green text
which wraps to the next line[0m
then clears after that`;

  const lines = value.split(/\r?\n/);
  const parser = createAnsiSequenceParser();

  const tokensByLine = lines.map((line) => parser.parse(line));

  expect(tokensByLine).toMatchInlineSnapshot(`
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
  const value = `[0;30mBlack[0;37mWhite[0;90mBright Black[0;97mBright White[0;32mGreen[0;38;2;31;222;162mPastel Green[0;38;5;87mTable Cyan
[0;40mBlack[0;47mWhite[0;100mBright Black[0;107mBright White[0;42mGreen[0;48;2;31;222;162mPastel Green[0;48;5;87mTable Cyan
[0;107;30mForeground and background[39mReset foreground[35;49mReset background`;

  const tokens = parseAnsiSequences(value);

  const colorPalette = createColorPalette();

  const tokensWithColorValue = tokens.map((token) => ({
    ...token,
    foregroundValue: token.foreground
      ? colorPalette.value(token.foreground)
      : null,
    backgroundValue: token.background
      ? colorPalette.value(token.background)
      : null,
  }));

  expect(tokensWithColorValue).toMatchInlineSnapshot(`
    [
      {
        "background": null,
        "backgroundValue": null,
        "decorations": Set {},
        "foreground": {
          "name": "black",
          "type": "named",
        },
        "foregroundValue": "#000000",
        "value": "Black",
      },
      {
        "background": null,
        "backgroundValue": null,
        "decorations": Set {},
        "foreground": {
          "name": "white",
          "type": "named",
        },
        "foregroundValue": "#eeeeee",
        "value": "White",
      },
      {
        "background": null,
        "backgroundValue": null,
        "decorations": Set {},
        "foreground": {
          "name": "brightBlack",
          "type": "named",
        },
        "foregroundValue": "#555555",
        "value": "Bright Black",
      },
      {
        "background": null,
        "backgroundValue": null,
        "decorations": Set {},
        "foreground": {
          "name": "brightWhite",
          "type": "named",
        },
        "foregroundValue": "#ffffff",
        "value": "Bright White",
      },
      {
        "background": null,
        "backgroundValue": null,
        "decorations": Set {},
        "foreground": {
          "name": "green",
          "type": "named",
        },
        "foregroundValue": "#00bb00",
        "value": "Green",
      },
      {
        "background": null,
        "backgroundValue": null,
        "decorations": Set {},
        "foreground": {
          "rgb": [
            31,
            222,
            162,
          ],
          "type": "rgb",
        },
        "foregroundValue": "#1fdea2",
        "value": "Pastel Green",
      },
      {
        "background": null,
        "backgroundValue": null,
        "decorations": Set {},
        "foreground": {
          "index": 87,
          "type": "table",
        },
        "foregroundValue": "#5fffff",
        "value": "Table Cyan
    ",
      },
      {
        "background": {
          "name": "black",
          "type": "named",
        },
        "backgroundValue": "#000000",
        "decorations": Set {},
        "foreground": null,
        "foregroundValue": null,
        "value": "Black",
      },
      {
        "background": {
          "name": "white",
          "type": "named",
        },
        "backgroundValue": "#eeeeee",
        "decorations": Set {},
        "foreground": null,
        "foregroundValue": null,
        "value": "White",
      },
      {
        "background": {
          "name": "brightBlack",
          "type": "named",
        },
        "backgroundValue": "#555555",
        "decorations": Set {},
        "foreground": null,
        "foregroundValue": null,
        "value": "Bright Black",
      },
      {
        "background": {
          "name": "brightWhite",
          "type": "named",
        },
        "backgroundValue": "#ffffff",
        "decorations": Set {},
        "foreground": null,
        "foregroundValue": null,
        "value": "Bright White",
      },
      {
        "background": {
          "name": "green",
          "type": "named",
        },
        "backgroundValue": "#00bb00",
        "decorations": Set {},
        "foreground": null,
        "foregroundValue": null,
        "value": "Green",
      },
      {
        "background": {
          "rgb": [
            31,
            222,
            162,
          ],
          "type": "rgb",
        },
        "backgroundValue": "#1fdea2",
        "decorations": Set {},
        "foreground": null,
        "foregroundValue": null,
        "value": "Pastel Green",
      },
      {
        "background": {
          "index": 87,
          "type": "table",
        },
        "backgroundValue": "#5fffff",
        "decorations": Set {},
        "foreground": null,
        "foregroundValue": null,
        "value": "Table Cyan
    ",
      },
      {
        "background": {
          "name": "brightWhite",
          "type": "named",
        },
        "backgroundValue": "#ffffff",
        "decorations": Set {},
        "foreground": {
          "name": "black",
          "type": "named",
        },
        "foregroundValue": "#000000",
        "value": "Foreground and background",
      },
      {
        "background": {
          "name": "brightWhite",
          "type": "named",
        },
        "backgroundValue": "#ffffff",
        "decorations": Set {},
        "foreground": null,
        "foregroundValue": null,
        "value": "Reset foreground",
      },
      {
        "background": null,
        "backgroundValue": null,
        "decorations": Set {},
        "foreground": {
          "name": "magenta",
          "type": "named",
        },
        "foregroundValue": "#ff00ff",
        "value": "Reset background",
      },
    ]
  `);
});

test('decorations', () => {
  const value = `[0;1mBold[0;2mDim[0;3mItalic[0;4mUnderline[0;7mReverse[0;9mStrikethrough
[0;1;2;3;4;7;9mAll
[0;1mStack 1[2mStack 2[3mStack 3[4mStack 4[7mStack 5[9mStack 6
[0;1;3mBold on[21mBold off[7mReverse on[27mReverse off`;

  const tokens = parseAnsiSequences(value);

  expect(tokens).toMatchInlineSnapshot(`
    [
      {
        "background": null,
        "decorations": Set {
          "bold",
        },
        "foreground": null,
        "value": "Bold",
      },
      {
        "background": null,
        "decorations": Set {
          "dim",
        },
        "foreground": null,
        "value": "Dim",
      },
      {
        "background": null,
        "decorations": Set {
          "italic",
        },
        "foreground": null,
        "value": "Italic",
      },
      {
        "background": null,
        "decorations": Set {
          "underline",
        },
        "foreground": null,
        "value": "Underline",
      },
      {
        "background": null,
        "decorations": Set {
          "reverse",
        },
        "foreground": null,
        "value": "Reverse",
      },
      {
        "background": null,
        "decorations": Set {
          "strikethrough",
        },
        "foreground": null,
        "value": "Strikethrough
    ",
      },
      {
        "background": null,
        "decorations": Set {
          "bold",
          "dim",
          "italic",
          "underline",
          "reverse",
          "strikethrough",
        },
        "foreground": null,
        "value": "All
    ",
      },
      {
        "background": null,
        "decorations": Set {
          "bold",
        },
        "foreground": null,
        "value": "Stack 1",
      },
      {
        "background": null,
        "decorations": Set {
          "bold",
          "dim",
        },
        "foreground": null,
        "value": "Stack 2",
      },
      {
        "background": null,
        "decorations": Set {
          "bold",
          "dim",
          "italic",
        },
        "foreground": null,
        "value": "Stack 3",
      },
      {
        "background": null,
        "decorations": Set {
          "bold",
          "dim",
          "italic",
          "underline",
        },
        "foreground": null,
        "value": "Stack 4",
      },
      {
        "background": null,
        "decorations": Set {
          "bold",
          "dim",
          "italic",
          "underline",
          "reverse",
        },
        "foreground": null,
        "value": "Stack 5",
      },
      {
        "background": null,
        "decorations": Set {
          "bold",
          "dim",
          "italic",
          "underline",
          "reverse",
          "strikethrough",
        },
        "foreground": null,
        "value": "Stack 6
    ",
      },
      {
        "background": null,
        "decorations": Set {
          "bold",
          "italic",
        },
        "foreground": null,
        "value": "Bold on",
      },
      {
        "background": null,
        "decorations": Set {
          "italic",
        },
        "foreground": null,
        "value": "Bold off",
      },
      {
        "background": null,
        "decorations": Set {
          "italic",
          "reverse",
        },
        "foreground": null,
        "value": "Reverse on",
      },
      {
        "background": null,
        "decorations": Set {
          "italic",
        },
        "foreground": null,
        "value": "Reverse off",
      },
    ]
  `);
});

test('edge cases', () => {
  const value = `[0m[1m[32m[43mStacked commands
[42;0mReset at end of sequence
[0;38mMissing color mode argument
[0;38;2;31;222mMissing color argument
[0;38;5mMissing color argument`;

  const tokens = parseAnsiSequences(value);

  expect(tokens).toMatchInlineSnapshot(`
    [
      {
        "background": {
          "name": "yellow",
          "type": "named",
        },
        "decorations": Set {
          "bold",
        },
        "foreground": {
          "name": "green",
          "type": "named",
        },
        "value": "Stacked commands
    ",
      },
      {
        "background": {
          "name": "green",
          "type": "named",
        },
        "decorations": Set {},
        "foreground": null,
        "value": "Reset at end of sequence
    ",
      },
      {
        "background": null,
        "decorations": Set {},
        "foreground": null,
        "value": "Missing color mode argument
    ",
      },
      {
        "background": null,
        "decorations": Set {},
        "foreground": null,
        "value": "Missing color argument
    ",
      },
      {
        "background": null,
        "decorations": Set {},
        "foreground": null,
        "value": "Missing color argument",
      },
    ]
  `);
});
