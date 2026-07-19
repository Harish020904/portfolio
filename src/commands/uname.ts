// ── uname command ──

import { registerCommand } from './registry';

export function registerUname(): void {
  registerCommand(
    'uname',
    (_args, flags) => {
      if (flags.includes('-a') || flags.includes('--all')) {
        return {
          output: 'Linux arch-portfolio 6.6.0-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux',
          exitCode: 0,
        };
      }

      if (flags.includes('-r') || flags.includes('--kernel-release')) {
        return { output: '6.6.0-arch1-1', exitCode: 0 };
      }

      if (flags.includes('-n') || flags.includes('--nodename')) {
        return { output: 'arch-portfolio', exitCode: 0 };
      }

      if (flags.includes('-m') || flags.includes('--machine')) {
        return { output: 'x86_64', exitCode: 0 };
      }

      if (flags.includes('-o') || flags.includes('--operating-system')) {
        return { output: 'GNU/Linux', exitCode: 0 };
      }

      return { output: 'Linux', exitCode: 0 };
    },
    'Print system information',
    {
      usage: 'uname [-amnro]',
      manual: [
        'UNAME(1)                 User Commands                 UNAME(1)',
        '',
        'NAME',
        '       uname - print system information',
        '',
        'SYNOPSIS',
        '       uname [-amnro]',
        '',
        'DESCRIPTION',
        '       Print certain system information.',
        '',
        '       -a, --all',
        '              print all information',
        '',
        '       -r, --kernel-release',
        '              print the kernel release',
        '',
        '       -n, --nodename',
        '              print the network node hostname',
        '',
        '       -m, --machine',
        '              print the machine hardware name',
        '',
        '       -o, --operating-system',
        '              print the operating system',
      ].join('\n'),
    },
  );
}
