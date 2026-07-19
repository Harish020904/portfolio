// ── Neofetch data builder ──

export function buildNeofetch(
  termCols: number,
  termRows: number,
  sessionStart: number,
): string {
  // Arch Linux ASCII logo — bold blue
  const logo = [
    '        /\\         ',
    '       /  \\        ',
    '      /\\   \\       ',
    '     /  __ _\\      ',
    '    / _/  \\_/\\     ',
    '   //  /         ',
    '  //  _/          ',
    ' ///  arch         ',
    '/___________\\     ',
  ].map((l) => `\x1b[1;34m${l}\x1b[0m`);

  // Calculate uptime
  const uptime = Math.floor((Date.now() - sessionStart) / 1000);
  let uptimeStr: string;
  if (uptime < 60) {
    uptimeStr = `${uptime}s`;
  } else if (uptime < 3600) {
    uptimeStr = `${Math.floor(uptime / 60)}m ${uptime % 60}s`;
  } else {
    uptimeStr = `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`;
  }

  // Attempt to read memory (Chrome-only API)
  let memStr = 'N/A';
  try {
    const perf = performance as any;
    if (perf.memory) {
      memStr = `${Math.round(perf.memory.usedJSHeapSize / 1048576)} MB / ∞`;
    }
  } catch {
    // ignore
  }

  // Info lines
  const info: string[] = [
    `\x1b[1;32mharish\x1b[0m@\x1b[1;32marchlinux\x1b[0m`,
    `\x1b[0m${'─'.repeat(17)}`,
    `\x1b[1;37mOS:\x1b[0m       Arch Linux x86_64`,
    `\x1b[1;37mHost:\x1b[0m     Portfolio v1.0`,
    `\x1b[1;37mKernel:\x1b[0m   6.6.0-arch1-1`,
    `\x1b[1;37mUptime:\x1b[0m   ${uptimeStr}`,
    `\x1b[1;37mShell:\x1b[0m    bash 5.2.26`,
    `\x1b[1;37mTerminal:\x1b[0m ${termCols}x${termRows}`,
    `\x1b[1;37mDE:\x1b[0m       React 19`,
    `\x1b[1;37mWM:\x1b[0m       Vite 8`,
    `\x1b[1;37mTheme:\x1b[0m    Terminal Dark`,
    `\x1b[1;37mFont:\x1b[0m     JetBrains Mono`,
    `\x1b[1;37mCPU:\x1b[0m      TypeScript 6.x`,
    `\x1b[1;37mGPU:\x1b[0m      CSS Animations`,
    `\x1b[1;37mMemory:\x1b[0m   ${memStr}`,
    '',
    `\x1b[40m  \x1b[41m  \x1b[42m  \x1b[43m  \x1b[44m  \x1b[45m  \x1b[46m  \x1b[47m  \x1b[0m`,
  ];

  // Pad logo lines to 24 chars (visible width) then zip with info
  const logoPad = 24;
  const maxLines = Math.max(logo.length, info.length);
  const lines: string[] = [''];

  for (let i = 0; i < maxLines; i++) {
    const logoLine = i < logo.length ? logo[i] : '';
    const infoLine = i < info.length ? info[i] : '';
    // Each logo line is wrapped in ANSI, so we pad the raw visible part
    const rawLogo = i < logo.length
      ? logo[i].replace(/\x1b\[[0-9;]*m/g, '')
      : '';
    const padding = ' '.repeat(Math.max(0, logoPad - rawLogo.length));
    lines.push(`${logoLine}${padding}  ${infoLine}`);
  }

  lines.push('');
  return lines.join('\n');
}
