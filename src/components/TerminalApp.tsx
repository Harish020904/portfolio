import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import 'xterm/css/xterm.css';
import { useTerminalStore } from '../hooks';
import { registerBuiltinCommands } from '../commands';
import { executeCommand } from '../commands/registry';
import { ASCII_HARISH, BOOT_LINES, WELCOME_MESSAGE } from '../data/bootSequence';

import { isDirectory } from '../filesystem';

const theme = {
  background: '#0d1117',
  foreground: '#e6edf3',
  cursor: '#e6edf3',
  cursorAccent: '#0d1117',
  black: '#484f58',
  red: '#ff7b72',
  green: '#56d364',
  yellow: '#e3b341',
  blue: '#79c0ff',
  magenta: '#bc8cff',
  cyan: '#39d0d8',
  white: '#b1bac4',
  brightBlack: '#6e7681',
  brightRed: '#ffa198',
  brightGreen: '#56d364',
  brightYellow: '#e3b341',
  brightBlue: '#79c0ff',
  brightMagenta: '#d2a8ff',
  brightCyan: '#56d4dd',
  brightWhite: '#e6edf3',
};

// Register commands once
let commandsRegistered = false;

// Matrix characters
const MATRIX_CHARS = 'ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄ0123456789';

export const TerminalApp: React.FC = () => {
  const termRef = useRef<HTMLDivElement>(null);
  const termInstance = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const inputBuffer = useRef<string>('');
  const matrixIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const matrixTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!commandsRegistered) {
      registerBuiltinCommands();
      commandsRegistered = true;
    }
  }, []);

  const getPromptString = () => {
    const cwd = useTerminalStore.getState().cwd;
    const displayPath = cwd.replace('/home/harish', '~') || '~';
    return `\x1b[1;32mharish@arch\x1b[0m:\x1b[1;34m${displayPath}\x1b[0m$ `;
  };

  const writePrompt = () => {
    if (termInstance.current) {
      termInstance.current.write(getPromptString());
    }
  };

  const replaceInput = (newInput: string) => {
    if (!termInstance.current) return;
    termInstance.current.write('\x1b[2K\r' + getPromptString() + newInput);
    inputBuffer.current = newInput;
  };



  const renderPager = (term: Terminal, state: ReturnType<typeof useTerminalStore.getState>) => {
    const { pageLines, pageIndex } = state;
    term.write('\x1b[2J\x1b[H');
    const rows = term.rows || 24;
    const pageHeight = Math.max(5, rows - 3);
    const endIndex = Math.min(pageLines.length, pageIndex + pageHeight);
    
    for (let i = pageIndex; i < endIndex; i++) {
      term.write(pageLines[i] + '\r\n');
    }
    
    const percent = Math.floor((endIndex / pageLines.length) * 100);
    term.write(`\x1b[7m --More-- (${percent}%) Press SPACE for next page, Enter for next line, q to quit \x1b[0m`);
  };

  const enterVimMode = (term: Terminal) => {
    term.write('\x1b[2J\x1b[H');
    const rows = term.rows || 24;
    const cols = term.cols || 80;

    // Write vim-style tildes for empty lines
    for (let i = 0; i < rows - 4; i++) {
      if (i === Math.floor((rows - 4) / 2) - 1) {
        const line1 = 'Lines of code like rain,';
        const pad1 = Math.max(0, Math.floor((cols - line1.length) / 2));
        term.write(' '.repeat(pad1) + `\x1b[1;36m${line1}\x1b[0m\r\n`);
      } else if (i === Math.floor((rows - 4) / 2)) {
        const line2 = 'Arch boots beneath my hands—';
        const pad2 = Math.max(0, Math.floor((cols - line2.length) / 2));
        term.write(' '.repeat(pad2) + `\x1b[1;36m${line2}\x1b[0m\r\n`);
      } else if (i === Math.floor((rows - 4) / 2) + 1) {
        const line3 = 'Kernel hums, I build.';
        const pad3 = Math.max(0, Math.floor((cols - line3.length) / 2));
        term.write(' '.repeat(pad3) + `\x1b[1;36m${line3}\x1b[0m\r\n`);
      } else {
        term.write('\x1b[34m~\x1b[0m\r\n');
      }
    }

    // Status bar at the bottom
    term.write('\r\n');
    term.write(`\x1b[7m -- NORMAL --   type :q to exit \x1b[0m`);
  };

  const startMatrixAnimation = (term: Terminal) => {
    term.write('\x1b[2J\x1b[H');

    matrixIntervalRef.current = setInterval(() => {
      const cols = term.cols || 80;
      let line = '';
      for (let i = 0; i < cols; i++) {
        if (Math.random() > 0.7) {
          const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          const brightness = Math.random() > 0.5 ? '1;32' : '32';
          line += `\x1b[${brightness}m${char}\x1b[0m`;
        } else {
          line += ' ';
        }
      }
      term.write(line + '\r\n');
    }, 50);

    matrixTimeoutRef.current = setTimeout(() => {
      if (matrixIntervalRef.current) {
        clearInterval(matrixIntervalRef.current);
        matrixIntervalRef.current = null;
      }
      term.write('\x1b[2J\x1b[H');
      term.write('\x1b[1;32mThere is no spoon.\x1b[0m\r\n\r\n');
      useTerminalStore.getState().setMatrixMode(false);
      writePrompt();
    }, 4000);
  };

  useEffect(() => {
    if (!termRef.current) return;

    const term = new Terminal({
      theme,
      fontFamily: 'JetBrains Mono, Fira Code, monospace',
      fontSize: 14,
      lineHeight: 1.4,
      scrollback: 2000,
      cursorBlink: true,
      cursorStyle: 'block',
    });

    const fit = new FitAddon();
    term.loadAddon(fit);
    term.loadAddon(new WebLinksAddon());

    term.open(termRef.current);
    fit.fit();
    useTerminalStore.getState().setTermSize(term.cols, term.rows);
    
    termInstance.current = term;
    fitAddon.current = fit;

    const handleResize = () => {
      fit.fit();
      useTerminalStore.getState().setTermSize(term.cols, term.rows);
    };
    window.addEventListener('resize', handleResize);

    term.focus();

    // URL Sync & Deep links
    const handlePopState = () => {
      const path = window.location.pathname;
      const { fsRoot, setCwd } = useTerminalStore.getState();
      if (isDirectory(fsRoot, path)) {
        setCwd(path);
        term.writeln('');
        term.writeln(`\x1b[2mNavigated to ${path}\x1b[0m`);
        writePrompt();
      } else {
        window.history.replaceState(null, '', '/home/harish');
        setCwd('/home/harish');
      }
    };
    window.addEventListener('popstate', handlePopState);

    const startPath = window.location.pathname;
    const { fsRoot } = useTerminalStore.getState();
    const validStart = isDirectory(fsRoot, startPath) ? startPath : '/home/harish';
    useTerminalStore.getState().setCwd(validStart);
    window.history.replaceState(null, '', validStart);

    // Boot sequence
    const runBoot = async () => {
      const { booted, setBooted } = useTerminalStore.getState();
      if (booted) {
        writePrompt();
        return;
      }

      // ASCII
      term.write(ASCII_HARISH.replace(/\n/g, '\r\n') + '\r\n');
      await new Promise((r) => setTimeout(r, 200));

      for (const bootLine of BOOT_LINES) {
        let text = bootLine.text;
        if (text.includes('[OK]')) {
          text = `   \x1b[32m[OK]\x1b[0m${text.substring(6)}`;
        }
        if (bootLine.style === 'dim') {
          text = `\x1b[2m${text}\x1b[0m`;
        } else if (bootLine.style === 'bright') {
          text = `\x1b[1m${text}\x1b[0m`;
        }
        term.write(text + '\r\n');
        await new Promise((r) => setTimeout(r, bootLine.delay));
      }

      await new Promise((r) => setTimeout(r, 200));
      term.write('\r\n' + WELCOME_MESSAGE.replace(/\n/g, '\r\n') + '\r\n\r\n');
      
      setBooted(true);
      writePrompt();
    };

    runBoot();

    term.onKey(({ key, domEvent }) => {
      const state = useTerminalStore.getState();
      const ev = domEvent as KeyboardEvent;
      
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

      // ── Matrix mode: swallow all keys ──
      if (state.isMatrixMode) {
        return;
      }

      // ── Vim mode ──
      if (state.isVimMode) {
        if (ev.key === 'Enter') {
          const buf = state.vimBuffer;
          if (buf.endsWith(':q')) {
            state.setVimMode(false);
            state.setVimBuffer('');
            term.write('\x1b[2J\x1b[H');
            writePrompt();
          } else {
            state.setVimBuffer('');
            // Redraw status line with hint
            term.write('\r\x1b[2K');
            term.write(`\x1b[7m -- NORMAL --   type :q to exit \x1b[0m`);
          }
        } else if (key.length === 1) {
          const updatedBuf = state.vimBuffer + key;
          state.setVimBuffer(updatedBuf);
          // Show the buffer at the bottom if it starts with ':'
          if (updatedBuf.startsWith(':')) {
            term.write('\r\x1b[2K');
            term.write(updatedBuf);
          }
        }
        return;
      }

      // ── Pager mode ──
      if (state.isPaging) {
        if (ev.key === ' ' || ev.key === 'Spacebar') {
          const rows = term.rows || 24;
          const pageHeight = Math.max(5, rows - 3);
          const newIndex = state.pageIndex + pageHeight;
          if (newIndex < state.pageLines.length) {
            state.setPagerState(true, state.pageLines, newIndex);
            renderPager(term, useTerminalStore.getState());
          } else {
            state.setPagerState(false);
            term.write('\x1b[2J\x1b[H');
            writePrompt();
          }
        } else if (ev.key === 'Enter') {
          const newIndex = state.pageIndex + 1;
          if (newIndex < state.pageLines.length) {
            state.setPagerState(true, state.pageLines, newIndex);
            renderPager(term, useTerminalStore.getState());
          } else {
            state.setPagerState(false);
            term.write('\x1b[2J\x1b[H');
            writePrompt();
          }
        } else if (ev.key === 'q') {
          state.setPagerState(false);
          term.write('\x1b[2J\x1b[H');
          writePrompt();
        }
        return;
      }

      // ── Ctrl+K: trigger neofetch ──
      if (ev.key === 'k' && ev.ctrlKey) {
        ev.preventDefault();
        term.write('\r\n');
        const result = executeCommand('neofetch', state);
        if (result.output) {
          const lines = result.output.split('\n');
          for (const line of lines) {
            term.write(line + '\r\n');
          }
        }
        inputBuffer.current = '';
        writePrompt();
        return;
      }

      // ── Normal input mode ──
      if (ev.key === 'Enter') {
        term.write('\r\n');
        const input = inputBuffer.current.trim();
        inputBuffer.current = '';

        if (input) {
          state.pushHistory(input);
          const result = executeCommand(input, state);
          
          if (result.exitCode === 99) {
            // Clear screen
            term.write('\x1b[2J\x1b[H');
          } else if (result.exitCode === 100) {
            // Pager mode
            renderPager(term, useTerminalStore.getState());
            return;
          } else if (result.exitCode === 101) {
            // Vim mode
            enterVimMode(term);
            return;
          } else if (result.exitCode === 102) {
            // Matrix mode
            startMatrixAnimation(term);
            return;
          } else if (result.output) {
            const lines = result.output.split('\n');
            for (const line of lines) {
              term.write(line + '\r\n');
            }
          }
          
          if (result.newCwd) {
            state.setCwd(result.newCwd);
            window.history.pushState(null, '', result.newCwd);
            document.title = `harish@arch: ${result.newCwd.replace('/home/harish', '~')} | harishragavender.tech`;
          }

          // Handle pending actions (e.g. source command)
          const pendingAction = useTerminalStore.getState().pendingAction;
          if (pendingAction === 'open-source') {
            useTerminalStore.getState().setPendingAction(null);
            window.open('https://github.com/harishragavender', '_blank');
          }
        }
        
        writePrompt();
      } else if (ev.key === 'Backspace') {
        if (inputBuffer.current.length > 0) {
          inputBuffer.current = inputBuffer.current.slice(0, -1);
          term.write('\x1b[D \x1b[D');
        }
      } else if (ev.key === 'ArrowUp') {
        const { cmdHistory, historyIndex } = state;
        if (cmdHistory.length > 0) {
          const newIndex = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
          state.setHistoryIndex(newIndex);
          replaceInput(cmdHistory[newIndex]);
        }
      } else if (ev.key === 'ArrowDown') {
        const { cmdHistory, historyIndex } = state;
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1;
          if (newIndex >= cmdHistory.length) {
            state.setHistoryIndex(-1);
            replaceInput('');
          } else {
            state.setHistoryIndex(newIndex);
            replaceInput(cmdHistory[newIndex]);
          }
        }
      } else if (ev.key === 'l' && ev.ctrlKey) {
        term.write('\x1b[2J\x1b[H');
        writePrompt();
        term.write(inputBuffer.current);
      } else if (ev.key === 'c' && ev.ctrlKey) {
        inputBuffer.current = '';
        term.write('^C\r\n');
        writePrompt();
      } else if (ev.key === 'Tab') {
        // Stub for now
      } else if (printable && key.length === 1) {
        inputBuffer.current += key;
        term.write(key);
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('popstate', handlePopState);
      if (matrixIntervalRef.current) clearInterval(matrixIntervalRef.current);
      if (matrixTimeoutRef.current) clearTimeout(matrixTimeoutRef.current);
      term.dispose();
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: '#0d1117' }}>
      <div style={{ height: '32px', background: '#161b22', display: 'flex', alignItems: 'center', padding: '0 12px', gap: '8px', flexShrink: 0 }}>
        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
        <span style={{ margin: 'auto', fontSize: '12px', color: '#8b949e', fontFamily: 'JetBrains Mono, Fira Code, monospace' }}>Harish Ragavender K — zsh</span>
      </div>
      <div ref={termRef} style={{ flex: 1, overflow: 'hidden', padding: '8px' }} />
    </div>
  );
};
