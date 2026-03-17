import { useState, useRef } from 'react';
import Badge from './Badge.jsx';

const SWIPE_THRESHOLD = 50; // px

export default function Quiz({ exam, onSubmit, onBack }) {
  const [current, setCurrent] = useState(0);
  const [animClass, setAnimClass] = useState('animate-slide-from-right');
  const [animKey, setAnimKey] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const touchStartX = useRef(null);
  const transitioning = useRef(false);

  const { questions, exam: examLabel, title, region, year, type, solutions } = exam;
  const q = questions[current];
  const total = questions.length;
  const answered = Object.keys(answers).length;
  const progress = Math.round((answered / total) * 100);

  function select(letter) {
    setAnswers(prev => ({ ...prev, [q.number]: letter }));
  }

  function goTo(index) {
    const clamped = Math.max(0, Math.min(total - 1, index));
    if (clamped === current || transitioning.current) return;
    const forward = clamped > current;
    transitioning.current = true;
    setAnimClass(forward ? 'animate-slide-to-left' : 'animate-slide-to-right');
    setTimeout(() => {
      setCurrent(clamped);
      setAnimKey(k => k + 1);
      setAnimClass(forward ? 'animate-slide-from-right' : 'animate-slide-from-left');
      transitioning.current = false;
    }, 150);
  }

  function handleSubmit() {
    if (answered < total) {
      setShowConfirm(true);
    } else {
      onSubmit(answers);
    }
  }

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) goTo(current + 1); // swipe left → next
    else goTo(current - 1);           // swipe right → prev
  }

  return (
    <div>
      {/* Header: Volver / Finalizar full width */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <button onClick={onBack} className="shrink-0 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium transition hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-700 dark:hover:bg-zinc-800">
          ← Volver
        </button>
        <button
          onClick={handleSubmit}
          className="shrink-0 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 active:scale-[0.98]"
        >
          Finalizar
        </button>
      </div>

      {/* Two-col on desktop, single col on mobile */}
      <div className="md:grid md:grid-cols-3 md:gap-6 md:items-start">

        {/* Left sidebar: title + quick navigation */}
        <div className="mt-6 md:mt-0 md:col-span-1 shrink-0">
          <h1 className="mb-1 text-2xl font-bold leading-tight text-balance">{examLabel ?? title}</h1>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {year   && <Badge>{year}</Badge>}
            {region && <Badge>{region}</Badge>}
            {type   && <Badge color={type === 'Ordinaria' ? 'blue' : 'amber'}>{type}</Badge>}
          </div>
          <p className="mb-4 tabular-nums text-sm text-zinc-400 dark:text-zinc-500">{answered} de {total} respondidas</p>
          <div className="flex flex-wrap gap-1.5">
            {questions.map((q2, idx) => {
              const ans = answers[q2.number];
              const sol = solutions?.[q2.number];
              const isAnnulled = sol === 'nula';
              const noSolution = solutions && sol === undefined;

              let navCls;
              if (idx === current) {
                navCls = 'bg-indigo-600 text-white';
              } else if (!ans) {
                navCls = 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700';
              } else if (isAnnulled) {
                navCls = 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300';
              } else if (noSolution) {
                navCls = 'bg-zinc-300 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400';
              } else if (ans === sol) {
                navCls = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300';
              } else {
                navCls = 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300';
              }

              return (
                <button
                  key={q2.number}
                  onClick={() => goTo(idx)}
                  className={`h-8 w-8 rounded-md text-xs font-semibold transition active:scale-[0.98] ${navCls}`}
                >
                  {q2.number}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <div className="mt-6 flex-1 min-w-0 md:mt-0 md:col-span-2">
          {/* Progress bar */}
          <div className="mt-2 mb-6 h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
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
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100 active:scale-[0.98] disabled:opacity-40 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              ← Anterior
            </button>
            <button
              onClick={() => goTo(current + 1)}
              disabled={current === total - 1}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-40"
            >
              Siguiente →
            </button>
          </div>

          {/* Question card */}
          <div
            className="relative"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div
              key={animKey}
              className={`relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-card dark:border-zinc-700 dark:bg-zinc-900 ${animClass}`}
            >
              <p className="mb-1 text-xs font-medium uppercase tracking-widest text-zinc-400">
                Pregunta {current + 1} / {total}
                {q.source && (
                  <span className="ml-2 normal-case text-zinc-300">· {q.source.year} {q.source.region} {q.source.type}</span>
                )}
              </p>
              <p className="mb-6 text-base font-medium leading-relaxed">{q.text}</p>

              {(() => {
                const userAns = answers[q.number];
                const correctAns = solutions?.[q.number];
                const isAnnulled = correctAns === 'nula';
                const hasResult = userAns && solutions && !isAnnulled && correctAns !== undefined;
                const isCorrect = hasResult && userAns === correctAns;

                return (
                  <>
                    <ul className="space-y-2">
                      {q.options.map(opt => {
                        const selected = userAns === opt.letter;
                        const isAnswer = hasResult && opt.letter === correctAns;
                        const isWrong = hasResult && selected && !isCorrect;

                        let cls = 'border-zinc-200 hover:border-indigo-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:border-indigo-500 dark:hover:bg-zinc-800';
                        if (isAnswer && selected) cls = 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-500';
                        else if (isAnswer) cls = 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-400';
                        else if (isWrong) cls = 'border-red-400 bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300 dark:border-red-400';
                        else if (selected && !hasResult) cls = 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-500';

                        let dotCls = 'border-zinc-300 text-zinc-500';
                        if (isAnswer) dotCls = 'border-emerald-500 bg-emerald-500 text-white';
                        else if (isWrong) dotCls = 'border-red-400 bg-red-400 text-white';
                        else if (selected && !hasResult) dotCls = 'border-indigo-500 bg-indigo-500 text-white';

                        return (
                          <li key={opt.letter}>
                            <button
                              onClick={() => !hasResult && select(opt.letter)}
                              className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${cls} ${hasResult ? 'cursor-default' : ''}`}
                            >
                              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${dotCls}`}>
                                {opt.letter.toUpperCase()}
                              </span>
                              <span className="flex-1">{opt.text}</span>
                              {isAnswer && <span className="ml-2 shrink-0 text-emerald-600">✓</span>}
                              {isWrong && <span className="ml-2 shrink-0 text-red-500">✗</span>}
                            </button>
                          </li>
                        );
                      })}
                    </ul>

                    {hasResult && (
                      <p className={`mt-4 text-sm font-medium ${isCorrect ? 'text-emerald-600' : 'text-red-500'}`}>
                        {isCorrect ? '¡Correcto!' : `Incorrecto — La respuesta correcta es la ${correctAns.toUpperCase()}`}
                      </p>
                    )}
                    {userAns && solutions && isAnnulled && (
                      <p className="mt-4 text-sm font-medium text-amber-600">Esta pregunta está anulada</p>
                    )}
                    {userAns && solutions && correctAns === undefined && (
                      <p className="mt-4 text-sm text-zinc-400 dark:text-zinc-500">No hay solución disponible para esta pregunta</p>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>

      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900 dark:border dark:border-zinc-700">
            <h2 className="mb-2 text-lg font-semibold">¿Finalizar el examen?</h2>
            <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
              Tienes {total - answered} {total - answered === 1 ? 'pregunta sin responder' : 'preguntas sin responder'}.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-lg border border-zinc-200 py-2 text-sm font-medium hover:bg-zinc-50 active:scale-[0.98] transition dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Seguir
              </button>
              <button
                onClick={() => { setShowConfirm(false); onSubmit(answers); }}
                className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700 active:scale-[0.98] transition"
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
