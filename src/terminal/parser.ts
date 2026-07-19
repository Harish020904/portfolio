// ── Shell command parser ──
// Parses raw input into structured ParsedCommand objects.
// Supports: quoted strings, combined flags (-la), long flags (--all),
// named flags (--key value), pipe detection, redirect detection.

export interface ParsedCommand {
  /** The command name (lowercase) */
  command: string;
  /** Positional arguments (non-flag tokens) */
  args: string[];
  /** Short and long flags as flat list: ['-l', '-a', '--all'] */
  flags: string[];
  /** Named flags with values: { body: "hello", output: "file.txt" } */
  namedFlags: Record<string, string>;
  /** The original raw input string */
  raw: string;
  /** Whether a pipe was detected in the input */
  hasPipe: boolean;
  /** Segments split by pipe, if any */
  pipeSegments: string[];
  /** Whether a redirect was detected */
  hasRedirect: boolean;
  /** Redirect target filename, if any */
  redirectTarget: string | null;
  /** Redirect type: '>' (overwrite) or '>>' (append) */
  redirectType: '>' | '>>' | null;
}

/**
 * Tokenize a raw input string, respecting quoted strings.
 * Handles single quotes, double quotes, and escaped characters.
 */
function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let escaped = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (escaped) {
      current += ch;
      escaped = false;
      continue;
    }

    if (ch === '\\' && !inSingleQuote) {
      escaped = true;
      continue;
    }

    if (ch === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      continue;
    }

    if (ch === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      continue;
    }

    if (ch === ' ' && !inSingleQuote && !inDoubleQuote) {
      if (current.length > 0) {
        tokens.push(current);
        current = '';
      }
      continue;
    }

    current += ch;
  }

  if (current.length > 0) {
    tokens.push(current);
  }

  return tokens;
}

/**
 * Parse a raw shell input string into a structured ParsedCommand.
 */
export function parseCommand(raw: string): ParsedCommand {
  const trimmed = raw.trim();

  const result: ParsedCommand = {
    command: '',
    args: [],
    flags: [],
    namedFlags: {},
    raw: trimmed,
    hasPipe: false,
    pipeSegments: [],
    hasRedirect: false,
    redirectTarget: null,
    redirectType: null,
  };

  if (!trimmed) return result;

  // ── Detect pipes (outside quotes) ──
  const pipeSegments = splitOutsideQuotes(trimmed, '|');
  if (pipeSegments.length > 1) {
    result.hasPipe = true;
    result.pipeSegments = pipeSegments.map((s) => s.trim());
  }

  // Work with just the first segment (or the whole thing if no pipe)
  let workingInput = pipeSegments[0].trim();

  // ── Detect redirects (outside quotes) ──
  const redirectMatch = workingInput.match(/\s*(>>|>)\s*(\S+)\s*$/);
  if (redirectMatch) {
    result.hasRedirect = true;
    result.redirectType = redirectMatch[1] as '>' | '>>';
    result.redirectTarget = redirectMatch[2];
    // Strip the redirect from the working input
    workingInput = workingInput.slice(0, redirectMatch.index).trim();
  }

  // ── Tokenize ──
  const tokens = tokenize(workingInput);
  if (tokens.length === 0) return result;

  // First token is the command
  result.command = tokens[0].toLowerCase();

  // ── Parse remaining tokens into args, flags, namedFlags ──
  // Known long flags that take a value argument
  const valueLongFlags = new Set(['--body', '--output', '--file', '--path', '--format', '--user']);

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.startsWith('--')) {
      // Long flag
      const flagName = token;

      // Check for --key=value syntax
      const eqIndex = token.indexOf('=');
      if (eqIndex !== -1) {
        const key = token.slice(2, eqIndex);
        const value = token.slice(eqIndex + 1);
        result.namedFlags[key] = value;
        result.flags.push(`--${key}`);
      } else if (valueLongFlags.has(token) && i + 1 < tokens.length) {
        // --key value syntax (next token is the value)
        const key = token.slice(2);
        result.namedFlags[key] = tokens[i + 1];
        result.flags.push(flagName);
        i++; // skip the value token
      } else {
        // Boolean long flag
        result.flags.push(flagName);
      }
    } else if (token.startsWith('-') && token.length > 1 && !token.match(/^-\d/)) {
      // Short flag(s) — expand combined flags like -la into -l, -a
      const chars = token.slice(1);
      for (const ch of chars) {
        result.flags.push(`-${ch}`);
      }
    } else {
      // Positional argument
      result.args.push(token);
    }
  }

  return result;
}

/**
 * Split a string by a delimiter, but only outside of quotes.
 */
function splitOutsideQuotes(input: string, delimiter: string): string[] {
  const segments: string[] = [];
  let current = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let escaped = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (escaped) {
      current += ch;
      escaped = false;
      continue;
    }

    if (ch === '\\') {
      escaped = true;
      current += ch;
      continue;
    }

    if (ch === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      current += ch;
      continue;
    }

    if (ch === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      current += ch;
      continue;
    }

    if (ch === delimiter && !inSingleQuote && !inDoubleQuote) {
      segments.push(current);
      current = '';
      continue;
    }

    current += ch;
  }

  segments.push(current);
  return segments;
}

/**
 * Check if a flag is present in the parsed flags list.
 * Supports both short (-l) and long (--all) forms.
 */
export function hasFlag(parsed: ParsedCommand, ...names: string[]): boolean {
  return names.some((name) => parsed.flags.includes(name));
}
