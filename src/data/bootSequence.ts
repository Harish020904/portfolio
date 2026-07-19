// ── Boot sequence content ──

export const ASCII_HARISH = `\x1b[32m
  _   _            _     _       ____                                       _             _  __
 | | | | __ _ _ __(_)___| |__   |  _ \\ __ _  __ _  __ ___   _____ _ __   __| | ___ _ __  | |/ /
 | |_| |/ _\` | '__| / __| '_ \\  | |_) / _\` |/ _\` |/ _\` \\ \\ / / _ \\ '_ \\ / _\` |/ _ \\ '__| | ' / 
 |  _  | (_| | |  | \\__ \\ | | | |  _ < (_| | (_| | (_| |\\ V /  __/ | | | (_| |  __/ |    | . \\ 
 |_| |_|\\__,_|_|  |_|___/_| |_| |_| \\_\\__,_|\\__, |\\__,_| \\_/ \\___|_| |_|\\__,_|\\___|_|    |_|\\_\\
                                            |___/                                              
\x1b[0m`;

export const BOOT_LINES: { text: string; delay: number; style?: string }[] = [
  { text: '', delay: 100 },
  { text: ':: loading kernel modules...', delay: 200, style: 'dim' },
  { text: '   [OK] loaded: portfolio.ko', delay: 150, style: 'dim' },
  { text: '   [OK] loaded: creativity.ko', delay: 120, style: 'dim' },
  { text: '   [OK] loaded: experience.ko', delay: 130, style: 'dim' },
  { text: '', delay: 80 },
  { text: ':: mounting filesystems...', delay: 200, style: 'dim' },
  { text: '   [OK] /home/harish', delay: 150, style: 'dim' },
  { text: '   [OK] /projects', delay: 120, style: 'dim' },
  { text: '   [OK] /skills', delay: 100, style: 'dim' },
  { text: '', delay: 80 },
  { text: ':: starting services...', delay: 200, style: 'dim' },
  { text: '   [OK] started: terminal-renderer.service', delay: 150, style: 'dim' },
  { text: '   [OK] started: portfolio-engine.service', delay: 130, style: 'dim' },
  { text: '', delay: 100 },
  { text: '  Arch Linux portfolio v1.0.0 (tty1)', delay: 300, style: 'bright' },
  { text: '', delay: 100 },
];

export const WELCOME_MESSAGE = `\x1b[38;5;245mWelcome to Harish Ragavender K's terminal portfolio — type '\x1b[37mhelp\x1b[38;5;245m' to begin\x1b[0m`;

export const DEFAULT_CWD = '/home/harish';

export const PROMPT_USER = 'Harish Ragavender K';
export const PROMPT_HOST = 'archlinux';
