// ── source command ──
// Sets pendingAction to 'open-source' so TerminalApp can call window.open

import { registerCommand } from './registry';

export function registerSource(): void {
  registerCommand(
    'source',
    (_args, _flags, state, _fs) => {
      state.setPendingAction('open-source');
      return {
        output: '\x1b[36mOpening source code...\x1b[0m',
        exitCode: 0,
      };
    },
    'Open the source code repository',
    {
      usage: 'source',
    },
  );
}
