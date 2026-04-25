function splitSections(markdown) {
  const lines = markdown.split('\n');
  const sections = [];
  let current = { title: 'root', content: [] };

  for (const line of lines) {
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      sections.push(current);
      current = { title: match[1].trim().toLowerCase(), content: [] };
      continue;
    }
    current.content.push(line);
  }
  sections.push(current);
  return sections;
}

function toBullets(lines = []) {
  return lines
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim());
}

function toOrdered(lines = []) {
  return lines
    .map((line) => line.trim())
    .filter((line) => /^\d+\.\s+/.test(line))
    .map((line) => line.replace(/^\d+\.\s+/, '').trim());
}

export function extractSections(markdown) {
  const sections = splitSections(markdown);
  const map = new Map();

  for (const section of sections) {
    map.set(section.title, {
      raw: section.content.join('\n').trim(),
      bullets: toBullets(section.content),
      ordered: toOrdered(section.content)
    });
  }
  return map;
}
