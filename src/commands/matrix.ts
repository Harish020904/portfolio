// ── matrix easter egg ──
// Sets isMatrixMode: true and returns exitCode 102 so TerminalApp handles the animation

import { registerCommand } from './registry';

export function registerMatrix(): void {
  registerCommand(
    'matrix',
    (_args, _flags, state, _fs) => {
      state.setMatrixMode(true);
      return { output: '', exitCode: 102 };
    },
    'Enter the Matrix',
    {
      usage: 'matrix',
    },
  );
}
