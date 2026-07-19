// ── btw easter egg ──

import { registerCommand } from './registry';

export function registerBtw(): void {
  registerCommand(
    'btw',
    () => ({
      output: '\x1b[1;36mbtw, I use Arch.\x1b[0m',
      exitCode: 0,
    }),
    'By the way...',
    {
      usage: 'btw',
    },
  );
}
