import { parseExam, parseSolutions, getExamTitle } from './utils/parseExam.js';

const examFiles = import.meta.glob('/exams/*.md', { query: '?raw', import: 'default' });
const solutionFiles = import.meta.glob('/solutions/*.md', { query: '?raw', import: 'default' });

export async function listExams() {
  return Promise.all(
    Object.keys(examFiles).map(async path => {
      const name = path.replace('/exams/', '').replace('.md', '');
      const hasSolution = `/solutions/${name}.md` in solutionFiles;
      const md = await examFiles[path]();
      const title = getExamTitle(md, name);
      return { name, title, hasSolution };
    })
  );
}

export async function loadExam(name) {
  const loader = examFiles[`/exams/${name}.md`];
  if (!loader) throw new Error(`Exam "${name}" not found`);

  const examMd = await loader();
  const questions = parseExam(examMd);
  const title = getExamTitle(examMd, name);

  let solutions = null;
  const solLoader = solutionFiles[`/solutions/${name}.md`];
  if (solLoader) {
    solutions = parseSolutions(await solLoader());
  }

  return { name, title, questions, solutions };
}
