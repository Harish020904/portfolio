// ── man command ──

import { registerCommand, getCommandManual, getRegisteredCommands } from './registry';

export function registerMan(): void {
  registerCommand(
    'man',
    (args) => {
      if (args.length === 0) {
        return {
          output: 'What manual page do you want?\nFor example, try \'man man\'.',
          exitCode: 1,
        };
      }

      const cmdName = args[0].toLowerCase();
      const manual = getCommandManual(cmdName);

      if (!manual) {
        const allCmds = getRegisteredCommands();
        if (allCmds.includes(cmdName)) {
          return {
            output: `No manual entry for ${cmdName}\n(command exists but has no man page)`,
            exitCode: 1,
          };
        }
        return {
          output: `No manual entry for ${cmdName}`,
          exitCode: 1,
        };
      }

      return {
        output: `\x1b[1m${manual}\x1b[0m`,
        exitCode: 0,
      };
    },
    'Show manual page for a command',
    {
      usage: 'man <command>',
      manual: [
        'MAN(1)                   User Commands                   MAN(1)',
        '',
        'NAME',
        '       man - display manual pages',
        '',
        'SYNOPSIS',
        '       man <command>',
        '',
        'DESCRIPTION',
        '       Display the manual page for the given command.',
        '       Each manual page includes the command name, synopsis,',
        '       description, and usage examples.',
        '',
        'EXAMPLES',
        '       man ls       Show the ls manual page',
        '       man cat      Show the cat manual page',
      ].join('\n'),
    },
  );
}
