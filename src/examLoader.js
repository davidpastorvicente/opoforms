import { parseExam, parseSolutions, getExamTitle } from './utils/parseExam.js';

const examFiles = import.meta.glob('/src/data/exams/**/*.md', { query: '?raw', import: 'default' });
const solutionFiles = import.meta.glob('/src/data/solutions/**/*.md', { query: '?raw', import: 'default' });

const REGION_LABELS = { clm: 'Castilla La Mancha' };
const TYPE_LABELS = { ordinaria: 'Ordinaria', extraordinaria: 'Extraordinaria' };

function parseMeta(name) {
  const parts = name.split('/');
  if (parts.length === 4) {
    const [exam, year, region, type] = parts;
    return {
      exam: exam.toUpperCase(),
      year: year,
      region: REGION_LABELS[region] ?? region.toUpperCase(),
      type: TYPE_LABELS[type] ?? type,
    };
  }
  return { exam: null, year: null, region: null, type: null };
}

export async function listExams() {
  return Promise.all(
    Object.keys(examFiles).map(async path => {
      const name = path.replace('/src/data/exams/', '').replace('.md', '');
      const hasSolution = `/src/data/solutions/${name}.md` in solutionFiles;
      const meta = parseMeta(name);
      // For standalone exams (no path metadata), read the file to get the # title
      const title = meta.exam ? null : getExamTitle(await examFiles[path](), name);
      return { name, hasSolution, ...meta, title };
    })
  );
}

export async function loadExam(name) {
  const loader = examFiles[`/src/data/exams/${name}.md`];
  if (!loader) throw new Error(`Exam "${name}" not found`);

  const examMd = await loader();
  const questions = parseExam(examMd);
  const meta = parseMeta(name);
  const title = meta.exam ? null : getExamTitle(examMd, name);

  let solutions = null;
  const solLoader = solutionFiles[`/src/data/solutions/${name}.md`];
  if (solLoader) {
    solutions = parseSolutions(await solLoader());
  }

  return { name, title, questions, solutions, ...meta };
}
