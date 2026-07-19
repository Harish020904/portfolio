export function renderContactCard(content: string): string {
  const lines = content.split('\n').filter((l) => l.trim() !== '');
  
  // Try to parse lines as "Key: Value" or just display them
  const parsedLines = lines.map((line) => {
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.substring(0, colonIdx).trim();
      const value = line.substring(colonIdx + 1).trim();
      return { key, value };
    }
    return { key: '', value: line.trim() };
  });

  const headerText = 'HARISH — Contact Info';
  let maxContentLen = headerText.length + 4;

  const formattedLines = parsedLines.map((item) => {
    if (item.key) {
      const lineText = ` ${item.key.padEnd(10)} \x1b[37m${item.value}\x1b[0m `;
      // the visible length doesn't include ANSI codes.
      // \x1b[37m is 5 chars, \x1b[0m is 4 chars. So subtract 9 from length.
      const visibleLen = 1 + Math.max(10, item.key.length) + 1 + item.value.length + 1;
      maxContentLen = Math.max(maxContentLen, visibleLen);
      return { text: lineText, visibleLen };
    } else {
      const lineText = ` \x1b[37m${item.value}\x1b[0m `;
      const visibleLen = 1 + item.value.length + 1;
      maxContentLen = Math.max(maxContentLen, visibleLen);
      return { text: lineText, visibleLen };
    }
  });

  const boxWidth = maxContentLen + 2; // +2 for padding on sides
  
  const topBorder = `\x1b[32m╔${'═'.repeat(boxWidth)}╗\x1b[0m`;
  const middleBorder = `\x1b[32m╠${'═'.repeat(boxWidth)}╣\x1b[0m`;
  const bottomBorder = `\x1b[32m╚${'═'.repeat(boxWidth)}╝\x1b[0m`;

  const headerPaddingRight = boxWidth - (headerText.length + 2);
  const headerLine = `\x1b[32m║\x1b[0m   ${headerText}${' '.repeat(Math.max(0, headerPaddingRight - 1))}\x1b[32m║\x1b[0m`;

  const bodyLines = formattedLines.map((item) => {
    const padding = boxWidth - item.visibleLen;
    return `\x1b[32m║\x1b[0m ${item.text}${' '.repeat(Math.max(0, padding - 1))}\x1b[32m║\x1b[0m`;
  });

  return [topBorder, headerLine, middleBorder, ...bodyLines, bottomBorder].join('\n');
}
