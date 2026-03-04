export function parseExam(markdown) {
  const questions = [];
  const blocks = markdown.split(/\n(?=\d+\.\s)/);

  for (const block of blocks) {
    const lines = block.trim().split('\n').filter(Boolean);
    if (!lines.length) continue;

    const headerMatch = lines[0].match(/^(\d+)\.\s+([\s\S]+)/);
    if (!headerMatch) continue;

    const number = parseInt(headerMatch[1], 10);
    let questionText = headerMatch[2].trim();
    const options = [];
    let i = 1;

    while (i < lines.length && !lines[i].match(/^\s*\*\s+[a-d]\)/)) {
      questionText += ' ' + lines[i].trim();
      i++;
    }
    for (; i < lines.length; i++) {
      const m = lines[i].match(/^\s*\*\s+([a-d])\)\s+([\s\S]+)/);
      if (m) options.push({ letter: m[1], text: m[2].trim() });
    }

    if (options.length > 0) questions.push({ number, text: questionText, options });
  }

  return questions;
}

export function parseSolutions(text) {
  const map = {};
  for (const line of text.split('\n')) {
    const m = line.trim().match(/^(\d+):\s*(.+)/);
    if (m) map[parseInt(m[1], 10)] = m[2].trim().toLowerCase();
  }
  return map;
}

export function getExamTitle(markdown, fallback) {
  const m = markdown.match(/^#\s+(.+)/m);
  return m ? m[1].trim() : fallback;
}
