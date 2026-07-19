// ── history command ──

import { registerCommand } from './registry';

export function registerHistory(): void {
  registerCommand(
    'history',
    (_args, _flags, state) => {
      const { cmdHistory } = state;

      if (cmdHistory.length === 0) {
        return { output: '  (no history)', exitCode: 0 };
      }

      const lines = cmdHistory.map(
        (cmd, i) => `  ${String(i + 1).padStart(4)}  ${cmd}`
      );

      return { output: lines.join('\n'), exitCode: 0 };
    },
    'Show command history',
    {
      usage: 'history',
      manual: [
        'HISTORY(1)               User Commands               HISTORY(1)',
        '',
        'NAME',
        '       history - display command history',
        '',
        'SYNOPSIS',
        '       history',
        '',
        'DESCRIPTION',
        '       Display a numbered list of all commands entered',
        '       during this session. Use ↑/↓ arrows to recall',
        '       previous commands at the prompt.',
      ].join('\n'),
    },
  );
}
