// ── Command registry & dispatcher ──
// Central registry for all terminal commands.
// Uses the new CommandFn signature and ParsedCommand parser.

import type { TerminalState } from '../terminal/terminalStore';
import type { FileNode } from '../filesystem';
import { parseCommand } from '../terminal/parser';
import type { ParsedCommand } from '../terminal/parser';

/**
 * Result returned by every command handler.
 * - output: the full text output (may contain ANSI codes + newlines)
 * - exitCode: 0 = success, 1 = error, 99 = clear the terminal
 * - newCwd: if the command changes directories
 */
export interface CommandResult {
  output: string;
  exitCode: number;
  newCwd?: string;
}

/**
 * The signature every command handler must implement.
 */
export type CommandFn = (
  args: string[],
  flags: string[],
  state: TerminalState,
  fs: FileNode,
) => CommandResult;

/** Metadata stored alongside each command handler. */
interface CommandEntry {
  handler: CommandFn;
  description: string;
  usage?: string;
  manual?: string;
}

// ── Internal registry ──
const registry = new Map<string, CommandEntry>();

/**
 * Register a command with its handler and description.
 */
export function registerCommand(
  name: string,
  handler: CommandFn,
  description: string,
  options?: { usage?: string; manual?: string },
): void {
  registry.set(name, {
    handler,
    description,
    usage: options?.usage,
    manual: options?.manual,
  });
}

/**
 * Execute a raw input string through the parser and dispatcher.
 */
export function executeCommand(rawInput: string, state: TerminalState): CommandResult {
  const parsed = parseCommand(rawInput);

  if (!parsed.command) {
    return { output: '', exitCode: 0 };
  }

  const entry = registry.get(parsed.command);

  if (!entry) {
    return {
      output: `bash: ${parsed.command}: command not found`,
      exitCode: 127,
    };
  }

  try {
    return entry.handler(parsed.args, parsed.flags, state, state.fsRoot);
  } catch (err) {
    return {
      output: `${parsed.command}: ${err instanceof Error ? err.message : 'unknown error'}`,
      exitCode: 1,
    };
  }
}

/**
 * Get all registered command names (sorted).
 */
export function getRegisteredCommands(): string[] {
  return Array.from(registry.keys()).sort();
}

/**
 * Get the description for a registered command.
 */
export function getCommandDescription(name: string): string | undefined {
  return registry.get(name)?.description;
}

/**
 * Get the usage string for a registered command.
 */
export function getCommandUsage(name: string): string | undefined {
  return registry.get(name)?.usage;
}

/**
 * Get the manual entry for a registered command.
 */
export function getCommandManual(name: string): string | undefined {
  return registry.get(name)?.manual;
}

/**
 * Get all command entries (for help display).
 */
export function getAllCommands(): Map<string, { description: string; usage?: string }> {
  const result = new Map<string, { description: string; usage?: string }>();
  for (const [name, entry] of registry) {
    result.set(name, { description: entry.description, usage: entry.usage });
  }
  return result;
}

// Re-export ParsedCommand for consumers
export type { ParsedCommand };
