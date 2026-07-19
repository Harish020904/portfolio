// ── cat command ──

import { registerCommand } from './registry';
import { resolvePath, getNode, readFile } from '../filesystem';
import { markdownToAnsi } from '../utils/markdownToAnsi';
import { renderContactCard } from '../utils/renderContactCard';
import { renderStackTable } from '../utils/renderStackTable';

export function registerCat(): void {
  registerCommand(
    'cat',
    (args, _flags, state, fs) => {
      if (args.length === 0) {
        return { output: 'cat: missing operand', exitCode: 1 };
      }

      const outputParts: string[] = [];
      let hasError = false;

      for (const arg of args) {
        const absPath = resolvePath(state.cwd, arg);
        const node = getNode(fs, absPath);

        if (!node) {
          outputParts.push(`cat: ${arg}: No such file or directory`);
          hasError = true;
          continue;
        }

        if (node.type === 'dir') {
          outputParts.push(`cat: ${arg}: Is a directory`);
          hasError = true;
          continue;
        }

        const content = readFile(fs, absPath);
        if (content !== null) {
          if (absPath.endsWith('info.txt')) {
            outputParts.push(renderContactCard(content));
          } else if (absPath.endsWith('stack.md')) {
            outputParts.push(renderStackTable(content));
          } else if (absPath.endsWith('.md')) {
            outputParts.push(markdownToAnsi(content, 80));
          } else {
            outputParts.push(content);
          }
        }
      }

      return {
        output: outputParts.join('\n'),
        exitCode: hasError ? 1 : 0,
      };
    },
    'Display file contents',
    {
      usage: 'cat [file...]',
      manual: [
        'CAT(1)                   User Commands                   CAT(1)',
        '',
        'NAME',
        '       cat - concatenate files and print on the standard output',
        '',
        'SYNOPSIS',
        '       cat [file...]',
        '',
        'DESCRIPTION',
        '       Concatenate FILE(s) to standard output.',
        '       With no FILE, or when FILE is -, read standard input.',
        '',
        'EXAMPLES',
        '       cat bio.txt           Display contents of bio.txt',
        '       cat f1.txt f2.txt     Display both files',
      ].join('\n'),
    },
  );
}
