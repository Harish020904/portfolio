export function renderStackTable(content: string): string {
  const lines = content.split('\n');
  const categories: { category: string; skills: string }[] = [];
  
  let currentCategory = '';
  let currentSkills: string[] = [];

  const flush = () => {
    if (currentCategory && currentSkills.length > 0) {
      categories.push({ category: currentCategory, skills: currentSkills.join('  ') });
    } else if (currentCategory) {
      categories.push({ category: currentCategory, skills: '-' });
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('#')) {
      flush();
      currentCategory = trimmed.replace(/^#+\s*/, '');
      currentSkills = [];
    } else if (trimmed.startsWith('- ')) {
      currentSkills.push(trimmed.substring(2));
    } else if (trimmed.startsWith('* ')) {
      currentSkills.push(trimmed.substring(2));
    } else if (trimmed.includes(':')) {
      // Fallback for "Category: skill1, skill2"
      const [cat, skillsStr] = trimmed.split(':');
      if (cat && skillsStr) {
        flush();
        currentCategory = cat.trim();
        currentSkills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
  }
  flush();

  if (categories.length === 0) {
    // If it's just plain text without recognizable structure, put it in a single row
    categories.push({ category: 'Info', skills: content.trim() || 'No skills listed' });
  }

  const catHeader = 'Category';
  const skillHeader = 'Skills';
  
  let maxCatLen = catHeader.length;
  let maxSkillLen = skillHeader.length;

  for (const row of categories) {
    maxCatLen = Math.max(maxCatLen, row.category.length);
    maxSkillLen = Math.max(maxSkillLen, row.skills.length);
  }

  // padding
  maxCatLen += 2;
  maxSkillLen += 2;

  const top = `┌${'─'.repeat(maxCatLen)}┬${'─'.repeat(maxSkillLen)}┐`;
  const middle = `├${'─'.repeat(maxCatLen)}┼${'─'.repeat(maxSkillLen)}┤`;
  const bottom = `└${'─'.repeat(maxCatLen)}┴${'─'.repeat(maxSkillLen)}┘`;

  const padRight = (str: string, len: number) => ` ${str} `.padEnd(len);

  const headerLine = `│${padRight(catHeader, maxCatLen)}│${padRight(skillHeader, maxSkillLen)}│`;
  
  const rows = categories.map((row) => {
    return `│${padRight(row.category, maxCatLen)}│${padRight(row.skills, maxSkillLen)}│`;
  });

  return [top, headerLine, middle, ...rows, bottom].join('\n');
}
