// ── Terminal store (Zustand) ──

import { create } from 'zustand';
import { createFileSystemTree } from '../filesystem';
import type { FileNode } from '../filesystem';

export interface TerminalLine {
  id: string;
  content: string;
  type: 'input' | 'output' | 'error' | 'system' | 'ascii' | 'boot';
  timestamp: number;
}

export interface TerminalState {
  // Lines displayed in the terminal
  lines: TerminalLine[];
  // Current working directory
  cwd: string;
  // Virtual filesystem root
  fsRoot: FileNode;
  // Terminal dimensions
  termCols: number;
  termRows: number;
  // Command history (ordered list of all commands entered)
  cmdHistory: string[];
  // Session start time (epoch ms)
  sessionStart: number;
  // Current position in history navigation
  historyIndex: number;
  // Current input value
  currentInput: string;
  // Whether boot sequence is complete
  booted: boolean;
  // Whether the terminal is ready for input
  ready: boolean;

  // Pager state for 'less' command
  isPaging: boolean;
  pageLines: string[];
  pageIndex: number;

  // Vim mode state
  isVimMode: boolean;
  vimBuffer: string;

  // Matrix mode state
  isMatrixMode: boolean;

  // Pending side-effect action (e.g. open URL)
  pendingAction: string | null;

  // Actions
  addLine: (content: string, type: TerminalLine['type']) => void;
  addLines: (lines: Array<{ content: string; type: TerminalLine['type'] }>) => void;
  clearLines: () => void;
  setCwd: (cwd: string) => void;
  setCurrentInput: (input: string) => void;
  pushHistory: (command: string) => void;
  setHistoryIndex: (index: number) => void;
  setBooted: (booted: boolean) => void;
  setReady: (ready: boolean) => void;
  setPagerState: (isPaging: boolean, pageLines?: string[], pageIndex?: number) => void;
  setVimMode: (isVimMode: boolean) => void;
  setVimBuffer: (vimBuffer: string) => void;
  setMatrixMode: (isMatrixMode: boolean) => void;
  setPendingAction: (action: string | null) => void;
  setTermSize: (cols: number, rows: number) => void;
}

let lineCounter = 0;

function createLine(content: string, type: TerminalLine['type']): TerminalLine {
  return {
    id: `line-${lineCounter++}-${Date.now()}`,
    content,
    type,
    timestamp: Date.now(),
  };
}

export const useTerminalStore = create<TerminalState>((set) => ({
  lines: [],
  cwd: '/home/harish',
  fsRoot: createFileSystemTree(),
  termCols: 80,
  termRows: 24,
  cmdHistory: [],
  sessionStart: Date.now(),
  historyIndex: -1,
  currentInput: '',
  booted: false,
  ready: false,
  isPaging: false,
  pageLines: [],
  pageIndex: 0,
  isVimMode: false,
  vimBuffer: '',
  isMatrixMode: false,
  pendingAction: null,

  addLine: (content, type) =>
    set((state) => ({
      lines: [...state.lines, createLine(content, type)],
    })),

  addLines: (newLines) =>
    set((state) => ({
      lines: [...state.lines, ...newLines.map((l) => createLine(l.content, l.type))],
    })),

  clearLines: () => set({ lines: [] }),

  setCwd: (cwd) => set({ cwd }),

  setCurrentInput: (input) => set({ currentInput: input }),

  pushHistory: (command) =>
    set((state) => ({
      cmdHistory: [...state.cmdHistory, command],
      historyIndex: -1,
    })),

  setHistoryIndex: (index) => set({ historyIndex: index }),

  setBooted: (booted) => set({ booted }),

  setReady: (ready) => set({ ready }),

  setPagerState: (isPaging, pageLines = [], pageIndex = 0) =>
    set({ isPaging, pageLines, pageIndex }),

  setVimMode: (isVimMode) => set({ isVimMode, vimBuffer: '' }),

  setVimBuffer: (vimBuffer) => set({ vimBuffer }),

  setMatrixMode: (isMatrixMode) => set({ isMatrixMode }),

  setPendingAction: (pendingAction) => set({ pendingAction }),

  setTermSize: (cols, rows) => set({ termCols: cols, termRows: rows }),
}));
