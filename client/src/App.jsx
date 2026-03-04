import { useState } from 'react';
import ExamList from './components/ExamList.jsx';
import Quiz from './components/Quiz.jsx';
import Results from './components/Results.jsx';

// views: 'list' | 'quiz' | 'results'
export default function App() {
  const [view, setView] = useState('list');
  const [examData, setExamData] = useState(null);
  const [answers, setAnswers] = useState({});

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
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <button
          onClick={backToList}
          className="text-xl font-semibold tracking-tight hover:text-indigo-600 transition-colors"
        >
          OpoForms
        </button>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10">
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
