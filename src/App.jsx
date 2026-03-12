import { useState, useEffect } from 'react';
import ExamList from './components/ExamList.jsx';
import Quiz from './components/Quiz.jsx';
import Results from './components/Results.jsx';

function getInitialDark() {
  const stored = localStorage.getItem('theme');
  if (stored) return stored === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// views: 'list' | 'quiz' | 'results'
export default function App() {
  const [view, setView] = useState('list');
  const [examData, setExamData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isDark, setIsDark] = useState(getInitialDark);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  function startExam(data) {
    setExamData(data);
    setAnswers({});
    setView('quiz');
  }

  function submitQuiz(userAnswers) {
    setAnswers(userAnswers);
    setView('results');
  }

  function restart() {
    setAnswers({});
    setView('quiz');
  }

  function backToList() {
    setExamData(null);
    setAnswers({});
    setView('list');
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            onClick={backToList}
            className="text-xl font-semibold tracking-tight hover:text-indigo-600 transition-colors dark:hover:text-indigo-400"
          >
            OpoForms
          </button>
          <button
            onClick={() => setIsDark(d => !d)}
            aria-label="Toggle dark mode"
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition-colors dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-6.07-.71.71M6.34 17.66l-.71.71m12.02 0-.71-.71M6.34 6.34l-.71-.71M12 5a7 7 0 1 0 0 14A7 7 0 0 0 12 5z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {view === 'list' && <ExamList onSelect={startExam} />}
        {view === 'quiz' && examData && (
          <Quiz exam={examData} onSubmit={submitQuiz} onBack={backToList} />
        )}
        {view === 'results' && examData && (
          <Results
            exam={examData}
            answers={answers}
            onRestart={restart}
            onBack={backToList}
          />
        )}
      </main>
    </div>
  );
}
