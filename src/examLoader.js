import { parseExam, parseSolutions, getExamTitle } from './utils/parseExam.js';

const examFiles = import.meta.glob('/src/data/exams/**/*.md', { query: '?raw', import: 'default' });
const solutionFiles = import.meta.glob('/src/data/solutions/**/*.md', { query: '?raw', import: 'default' });

const REGION_LABELS = { clm: 'Castilla La Mancha' };
const TYPE_LABELS = { ordinaria: 'Ordinaria', extraordinaria: 'Extraordinaria' };

function parseMeta(name) {
  const parts = name.split('/');
  if (parts.length === 4) {
    const [exam, region, year, type] = parts;
    return {
      exam: exam.toUpperCase(),
      region: REGION_LABELS[region] ?? region.toUpperCase(),
      year,
      type: TYPE_LABELS[type] ?? type,
    };
  }
  return { exam: null, region: null, year: null, type: null };
}

export async function listExams() {
  return Promise.all(
    Object.keys(examFiles).map(async path => {
      const name = path.replace('/src/data/exams/', '').replace('.md', '');
      const hasSolution = `/src/data/solutions/${name}.md` in solutionFiles;
      const md = await examFiles[path]();
      const title = getExamTitle(md, name);
      const meta = parseMeta(name);
      return { name, title, hasSolution, ...meta };
    })
  );
}

export async function loadExam(name) {
  const loader = examFiles[`/src/data/exams/${name}.md`];
  if (!loader) throw new Error(`Exam "${name}" not found`);

  const examMd = await loader();
  const questions = parseExam(examMd);
  const title = getExamTitle(examMd, name);

  let solutions = null;
  const solLoader = solutionFiles[`/src/data/solutions/${name}.md`];
  if (solLoader) {
    solutions = parseSolutions(await solLoader());
  }

  return { name, title, questions, solutions };
}
