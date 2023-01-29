import { Color, ColorName, namedColors } from './colors';

export function createColorPalette(namedColorsMap: Record<ColorName, string>) {
  function namedColor(name: ColorName) {
    return namedColorsMap[name];
  }

  function rgbColor(rgb: [number, number, number]) {
    return `#${rgb
      .map((x) => Math.max(0, Math.min(x, 255)).toString(16).padStart(2, '0'))
      .join('')}`;
  }

  let colorTable: string[];
  // See: https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit
  function getColorTable() {
    if (colorTable) {
      return colorTable;
    }

    colorTable = [];
    for (let i = 0; i < namedColors.length; i++) {
      colorTable.push(namedColor(namedColors[i]));
    }

    let levels = [0, 95, 135, 175, 215, 255];
    for (let r = 0; r < 6; r++) {
      for (let g = 0; g < 6; g++) {
        for (let b = 0; b < 6; b++) {
          colorTable.push(rgbColor([levels[r], levels[g], levels[b]]));
        }
      }
    }

    let level = 8;
    for (let i = 0; i < 24; i++, level += 10) {
      colorTable.push(rgbColor([level, level, level]));
    }

    return colorTable;
  }

  function tableColor(index: number) {
    return getColorTable()[index];
  }

  function value(color: Color) {
    switch (color.type) {
      case 'named':
        return namedColor(color.name);
      case 'rgb':
        return rgbColor(color.rgb);
      case 'table':
        return tableColor(color.index);
    }
  }

  return {
    value,
  };
}
