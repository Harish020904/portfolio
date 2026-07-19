// ── ANSI escape code parser → React spans ──

import React from 'react';

interface TextSegment {
  text: string;
  style: React.CSSProperties;
}

const ANSI_COLORS: Record<number, string> = {
  30: '#484f58', // black
  31: '#f85149', // red
  32: '#3fb950', // green
  33: '#d29922', // yellow
  34: '#58a6ff', // blue
  35: '#bc8cff', // magenta
  36: '#39c5cf', // cyan
  37: '#c9d1d9', // white
  90: '#6e7681', // bright black (gray)
  91: '#ffa198', // bright red
  92: '#56d364', // bright green
  93: '#e3b341', // bright yellow
  94: '#79c0ff', // bright blue
  95: '#d2a8ff', // bright magenta
  96: '#56d4dd', // bright cyan
  97: '#ffffff', // bright white
};

const ANSI_BG_COLORS: Record<number, string> = {
  40: '#484f58',
  41: '#f85149',
  42: '#3fb950',
  43: '#d29922',
  44: '#58a6ff',
  45: '#bc8cff',
  46: '#39c5cf',
  47: '#c9d1d9',
};

// 256-color lookup for \x1b[38;5;Nm
const COLOR_256: Record<number, string> = {
  245: '#8b949e',
  246: '#8b949e',
  240: '#484f58',
  250: '#b1bac4',
  255: '#ffffff',
};

/**
 * Parse a string containing ANSI escape codes and return React elements with appropriate styling.
 */
export function parseAnsi(input: string): React.ReactNode[] {
  const segments: TextSegment[] = [];
  let currentStyle: React.CSSProperties = {};

  // Match ANSI escape sequences
  const regex = /\x1b\[([0-9;]*)m/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    // Add text before this escape sequence
    if (match.index > lastIndex) {
      segments.push({
        text: input.slice(lastIndex, match.index),
        style: { ...currentStyle },
      });
    }

    // Parse the escape codes
    const codes = match[1].split(';').map(Number);
    currentStyle = applyAnsiCodes(codes, currentStyle);

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < input.length) {
    segments.push({
      text: input.slice(lastIndex),
      style: { ...currentStyle },
    });
  }

  // Convert to React elements
  return segments.map((segment, i) =>
    React.createElement(
      'span',
      { key: i, style: Object.keys(segment.style).length > 0 ? segment.style : undefined },
      segment.text
    )
  );
}

function applyAnsiCodes(
  codes: number[],
  currentStyle: React.CSSProperties
): React.CSSProperties {
  const style = { ...currentStyle };

  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];

    if (code === 0) {
      // Reset
      return {};
    } else if (code === 1) {
      style.fontWeight = 'bold';
    } else if (code === 2) {
      style.opacity = 0.6;
    } else if (code === 3) {
      style.fontStyle = 'italic';
    } else if (code === 4) {
      style.textDecoration = 'underline';
    } else if (code === 38) {
      // Extended foreground color
      if (codes[i + 1] === 5) {
        // 256-color mode
        const colorIndex = codes[i + 2];
        if (COLOR_256[colorIndex]) {
          style.color = COLOR_256[colorIndex];
        }
        i += 2;
      }
    } else if (ANSI_COLORS[code]) {
      style.color = ANSI_COLORS[code];
    } else if (ANSI_BG_COLORS[code]) {
      style.backgroundColor = ANSI_BG_COLORS[code];
    }
  }

  return style;
}
