import { useState } from 'react';

export default function Quiz({ exam, onSubmit, onBack }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState('next');
  const [answers, setAnswers] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  const { questions, title } = exam;
  const q = questions[current];
  const total = questions.length;
  const answered = Object.keys(answers).length;
  const progress = Math.round((answered / total) * 100);

  function select(letter) {
    setAnswers(prev => ({ ...prev, [q.number]: letter }));
  }

  function goTo(index) {
    const clamped = Math.max(0, Math.min(total - 1, index));
    setDirection(clamped > current ? 'next' : 'prev');
    setCurrent(clamped);
  }

  function handleSubmit() {
    if (answered < total) {
      setShowConfirm(true);
    } else {
      onSubmit(answers);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button onClick={onBack} className="mb-1 text-sm text-zinc-400 hover:text-zinc-700 transition-colors">
            ← Volver
          </button>
          <h1 className="text-2xl font-bold leading-tight">{title}</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {answered} de {total} respondidas
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8 h-1.5 w-full rounded-full bg-zinc-200">
        <div
          className="h-1.5 rounded-full bg-indigo-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Navigation */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100 disabled:opacity-40"
        >
          ← Anterior
        </button>

        <button
          onClick={() => goTo(current + 1)}
          disabled={current === total - 1}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-40"
        >
          Siguiente →
        </button>
      </div>

      {/* Question card */}
      <div className="relative">
        <div
          key={current}
          className={`relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm ${
            direction === 'next' ? 'animate-slide-from-right' : 'animate-slide-from-left'
          }`}
        >
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-zinc-400">
            Pregunta {current + 1} / {total}
          </p>
          <p className="mb-6 text-base font-medium leading-relaxed">{q.text}</p>

          <ul className="space-y-2">
            {q.options.map(opt => {
              const selected = answers[q.number] === opt.letter;
              return (
                <li key={opt.letter}>
                  <button
                    onClick={() => select(opt.letter)}
                    className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition
                      ${selected
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-zinc-200 hover:border-indigo-300 hover:bg-zinc-50'
                      }`}
                  >
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold
                      ${selected ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-zinc-300 text-zinc-500'}`}>
                      {opt.letter.toUpperCase()}
                    </span>
                    <span>{opt.text}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSubmit}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          Finalizar examen
        </button>
      </div>

      {/* Question dots (mini navigator) */}
      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-zinc-400 uppercase tracking-widest">Navegación rápida</p>
        <div className="flex flex-wrap gap-1.5">
          {questions.map((q2, idx) => (
            <button
              key={q2.number}
              onClick={() => goTo(idx)}
              className={`h-7 w-7 rounded-md text-xs font-semibold transition
                ${idx === current
                  ? 'bg-indigo-600 text-white'
                  : answers[q2.number]
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                }`}
            >
              {q2.number}
            </button>
          ))}
        </div>
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-2 text-lg font-semibold">¿Finalizar el examen?</h2>
            <p className="mb-6 text-sm text-zinc-500">
              Tienes {total - answered} {total - answered === 1 ? 'pregunta sin responder' : 'preguntas sin responder'}.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-lg border border-zinc-200 py-2 text-sm font-medium hover:bg-zinc-50 transition"
              >
                Seguir
              </button>
              <button
                onClick={() => { setShowConfirm(false); onSubmit(answers); }}
                className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition"
              >
                Finalizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

