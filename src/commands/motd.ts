// ── motd command ──

import { registerCommand } from './registry';
import { getRandomQuote } from '../data/quotes';

export function registerMotd(): void {
  registerCommand(
    'motd',
    () => {
      const quote = getRandomQuote();
      return {
        output: `\n  \x1b[1;33m"\x1b[0m \x1b[3m${quote.text}\x1b[23m \x1b[1;33m"\x1b[0m\n  \x1b[2m— ${quote.author}\x1b[0m\n`,
        exitCode: 0,
      };
    },
    'Message of the day',
    {
      usage: 'motd',
    },
  );
}
