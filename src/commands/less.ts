import { registerCommand } from './registry';
import { resolvePath, getNode, readFile } from '../filesystem';
import { markdownToAnsi } from '../utils/markdownToAnsi';
import { renderContactCard } from '../utils/renderContactCard';
import { renderStackTable } from '../utils/renderStackTable';

export function registerLess(): void {
  registerCommand(
    'less',
    (args, _flags, state, fs) => {
      if (args.length === 0) {
        return { output: 'less: missing file operand', exitCode: 1 };
      }

      const absPath = resolvePath(state.cwd, args[0]);
      const node = getNode(fs, absPath);

      if (!node) {
        return { output: `less: ${args[0]}: No such file or directory`, exitCode: 1 };
      }

      if (node.type === 'dir') {
        return { output: `less: ${args[0]}: Is a directory`, exitCode: 1 };
      }

      const content = readFile(fs, absPath);
      if (content === null) {
        return { output: `less: ${args[0]}: Cannot read file`, exitCode: 1 };
      }

      let renderedOutput = content;
      if (absPath.endsWith('info.txt')) {
        renderedOutput = renderContactCard(content);
      } else if (absPath.endsWith('stack.md')) {
        renderedOutput = renderStackTable(content);
      } else if (absPath.endsWith('.md')) {
        renderedOutput = markdownToAnsi(content, 80);
      }

      const lines = renderedOutput.split('\n');

      // Enter paging mode
      state.setPagerState(true, lines, 0);

      // Return exitCode 100 as a special signal for TerminalApp to handle pager start,
      // or we just return empty and TerminalApp observes state.isPaging
      return { output: '', exitCode: 100 };
    },
    'View file contents with pagination',
    {
      usage: 'less [file]',
      manual: [
        'LESS(1)                 User Commands                 LESS(1)',
        '',
        'NAME',
        '       less - opposite of more',
        '',
        'SYNOPSIS',
        '       less [file]',
        '',
        'DESCRIPTION',
        '       View the contents of a file one page at a time.',
        '       Press SPACE to advance a page, Enter to advance a line,',
        '       and q to quit.',
      ].join('\n'),
    }
  );
}
