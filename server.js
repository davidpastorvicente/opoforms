import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

const EXAMS_DIR = path.join(__dirname, 'exams');
const SOLUTIONS_DIR = path.join(__dirname, 'solutions');

// Parse exam markdown into structured questions
function parseExam(markdown) {
  const questions = [];
  // Split by numbered question pattern (e.g. "1. ", "12. ")
  const blocks = markdown.split(/\n(?=\d+\.\s)/);

  for (const block of blocks) {
    const lines = block.trim().split('\n').filter(Boolean);
    if (!lines.length) continue;

    const headerMatch = lines[0].match(/^(\d+)\.\s+([\s\S]+)/);
    if (!headerMatch) continue;

    const number = parseInt(headerMatch[1], 10);
    let questionText = headerMatch[2].trim();

    // Question may span multiple lines before the first option
    const options = [];
    let i = 1;
    while (i < lines.length && !lines[i].match(/^\s*\*\s+[a-d]\)/)) {
      questionText += ' ' + lines[i].trim();
      i++;
    }

    for (; i < lines.length; i++) {
      const optMatch = lines[i].match(/^\s*\*\s+([a-d])\)\s+([\s\S]+)/);
      if (optMatch) {
        options.push({ letter: optMatch[1], text: optMatch[2].trim() });
      }
    }

    if (options.length > 0) {
      questions.push({ number, text: questionText, options });
    }
  }

  return questions;
}

// Parse solution file (line format: "N: letter" or "N: ANULADA")
function parseSolutions(text) {
  const map = {};
  for (const line of text.split('\n')) {
    const m = line.trim().match(/^(\d+):\s*(.+)/);
    if (m) map[parseInt(m[1], 10)] = m[2].trim().toLowerCase();
  }
  return map;
}

// List available exams
app.get('/api/exams', (req, res) => {
  const files = fs.readdirSync(EXAMS_DIR).filter(f => f.endsWith('.md'));
  const exams = files.map(f => {
    const name = path.basename(f, '.md');
    const hasSolution = fs.existsSync(path.join(SOLUTIONS_DIR, f));
    return { name, hasSolution };
  });
  res.json(exams);
});

// Get a single exam with questions (and solutions if available)
app.get('/api/exams/:name', (req, res) => {
  const examFile = path.join(EXAMS_DIR, `${req.params.name}.md`);
  if (!fs.existsSync(examFile)) return res.status(404).json({ error: 'Exam not found' });

  const examMd = fs.readFileSync(examFile, 'utf-8');
  const questions = parseExam(examMd);

  let solutions = null;
  const solutionFile = path.join(SOLUTIONS_DIR, `${req.params.name}.md`);
  if (fs.existsSync(solutionFile)) {
    solutions = parseSolutions(fs.readFileSync(solutionFile, 'utf-8'));
  }

  // Extract title from first heading if present
  const titleMatch = examMd.match(/^#{1,3}\s+(.+)/m);
  const title = titleMatch ? titleMatch[1].trim() : req.params.name;

  res.json({ name: req.params.name, title, questions, solutions });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
