// ── help command ──

import { registerCommand, getAllCommands } from './registry';

export function registerHelp(): void {
  registerCommand(
    'help',
    () => {
      const commands = getAllCommands();
      const entries = Array.from(commands.entries()).sort(([a], [b]) => a.localeCompare(b));

      // Find the longest command name for alignment
      const maxNameLen = Math.max(...entries.map(([name]) => name.length));
      const gap = 4;

      // Calculate total box width based on longest line
      const maxLineLen = Math.max(
        ...entries.map(([name, { description }]) => 2 + name.length + gap + (maxNameLen - name.length) + description.length + 1),
        'Available Commands'.length + 4,
        'Tip: Use ↑/↓ arrows to navigate history'.length + 4,
        'Tip: Tab to autocomplete commands'.length + 4,
        'Tip: Type man <cmd> for detailed manual pages'.length + 4,
      );
      const boxWidth = Math.max(maxLineLen, 55);
      const hr = '─'.repeat(boxWidth);

      const padLine = (content: string, visibleLen: number) => {
        const rightPad = Math.max(0, boxWidth - visibleLen);
        return `\x1b[32m│\x1b[0m${content}${' '.repeat(rightPad)}\x1b[32m│\x1b[0m`;
      };

      const lines: string[] = [
        '',
        `\x1b[32m╭${hr}╮\x1b[0m`,
        padLine(`  \x1b[1m\x1b[97mAvailable Commands\x1b[0m`, 2 + 18),
        `\x1b[32m├${hr}┤\x1b[0m`,
        padLine('', 0),
      ];

      for (const [name, { description }] of entries) {
        const padding = ' '.repeat(maxNameLen - name.length + gap);
        const visibleLen = 2 + name.length + padding.length + description.length + 1;
        lines.push(
          padLine(`  \x1b[36m${name}\x1b[0m${padding}${description} `, visibleLen)
        );
      }

      lines.push(
        padLine('', 0),
        padLine(`  \x1b[33mTip:\x1b[0m Use ↑/↓ arrows to navigate history`, 2 + 'Tip: Use ↑/↓ arrows to navigate history'.length),
        padLine(`  \x1b[33mTip:\x1b[0m Tab to autocomplete commands`, 2 + 'Tip: Tab to autocomplete commands'.length),
        padLine(`  \x1b[33mTip:\x1b[0m Type \x1b[36mman <cmd>\x1b[0m for detailed manual pages`, 2 + 'Tip: Type man <cmd> for detailed manual pages'.length),
        padLine(`  \x1b[33mTip:\x1b[0m Press \x1b[36mCtrl+K\x1b[0m for neofetch`, 2 + 'Tip: Press Ctrl+K for neofetch'.length),
        `\x1b[32m╰${hr}╯\x1b[0m`,
        '',
      );

      return { output: lines.join('\n'), exitCode: 0 };
    },
    'Show available commands',
    {
      usage: 'help',
      manual: [
        'HELP(1)                  User Commands                  HELP(1)',
        '',
        'NAME',
        '       help - display a list of available commands',
        '',
        'SYNOPSIS',
        '       help',
        '',
        'DESCRIPTION',
        '       Display a list of all available commands with their',
        '       descriptions. Use "man <cmd>" for detailed help.',
      ].join('\n'),
    },
  );
}
