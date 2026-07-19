// ── neofetch command ──

import { registerCommand } from './registry';
import { buildNeofetch } from '../data/neofetch';

export function registerNeofetch(): void {
  registerCommand(
    'neofetch',
    (_args, _flags, state, _fs) => ({
      output: buildNeofetch(state.termCols, state.termRows, state.sessionStart),
      exitCode: 0,
    }),
    'Display system info with ASCII art',
    {
      usage: 'neofetch',
      manual: [
        'NEOFETCH(1)              User Commands              NEOFETCH(1)',
        '',
        'NAME',
        '       neofetch - a CLI system information tool',
        '',
        'SYNOPSIS',
        '       neofetch',
        '',
        'DESCRIPTION',
        '       Display system information alongside the Arch Linux',
        '       ASCII art logo. Shows OS, kernel, shell, DE/WM,',
        '       theme, font, uptime, and hardware information.',
      ].join('\n'),
    },
  );
}
