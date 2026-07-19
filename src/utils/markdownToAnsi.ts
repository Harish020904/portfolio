export function markdownToAnsi(input: string, terminalWidth: number = 80): string {
  const lines = input.split('\n');
  const result: string[] = [];
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Handle code blocks
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        const lang = line.substring(3).trim();
        if (lang) {
          result.push(`\x1b[2m ${lang} \x1b[0m`);
        }
      } else {
        inCodeBlock = false;
      }
      continue;
    }

    if (inCodeBlock) {
      result.push(`  \x1b[93m ${line} \x1b[0m`);
      continue;
    }

    // Horizontal Rule
    if (line.trim() === '---') {
      result.push(`\x1b[2m${'─'.repeat(terminalWidth)}\x1b[0m`);
      continue;
    }

    // Headers
    if (line.startsWith('# ')) {
      result.push('');
      result.push(`\x1b[1;32m ${line.substring(2).trim()} \x1b[0m`);
      result.push('');
      continue;
    }
    if (line.startsWith('## ')) {
      result.push(`\x1b[1;36m ${line.substring(3).trim()} \x1b[0m`);
      continue;
    }
    if (line.startsWith('### ')) {
      result.push(`\x1b[1;34m ${line.substring(4).trim()} \x1b[0m`);
      continue;
    }

    // List items
    if (line.trim().startsWith('- ')) {
      const indent = line.substring(0, line.indexOf('-'));
      const content = line.substring(line.indexOf('-') + 2);
      line = `${indent}  \x1b[36m•\x1b[0m ${content}`;
    }

    // Blockquotes
    if (line.startsWith('> ')) {
      line = `\x1b[2m │ \x1b[0m${line.substring(2)}`;
    }

    // Inline formatting
    // Bold
    line = line.replace(/\*\*(.*?)\*\*/g, '\x1b[1m$1\x1b[22m');
    // Italic
    line = line.replace(/\*(.*?)\*/g, '\x1b[3m$1\x1b[23m');
    // Inline code
    line = line.replace(/`(.*?)`/g, '\x1b[48;5;236m\x1b[93m $1 \x1b[0m');
    // Links
    line = line.replace(/\[(.*?)\]\((.*?)\)/g, '\x1b[4;36m$1\x1b[0m \x1b[2m($2)\x1b[0m');

    result.push(line);
  }

  // Trim trailing empty lines added by H1 padding
  while (result.length > 0 && result[result.length - 1] === '') {
    result.pop();
  }
  while (result.length > 0 && result[0] === '') {
    result.shift();
  }

  return result.join('\n');
}
