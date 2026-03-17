export default function Results({ exam, answers, onRestart, onBack }) {
  const { questions, solutions, title } = exam;

  const hasSolutions = solutions && Object.keys(solutions).length > 0;

  let correct = 0;
  let wrong = 0;
  let skipped = 0;
  let annulled = 0;
  let noSolutionCount = 0;

  questions.forEach(q => {
    const userAns = answers[q.number];
    const correctAns = solutions?.[q.number];

    if (correctAns === 'nula') { annulled++; return; }
    if (hasSolutions && correctAns === undefined) { noSolutionCount++; return; }
    if (!userAns) { skipped++; return; }
    if (!hasSolutions) return;
    if (userAns === correctAns) correct++;
    else wrong++;
  });

  const scored = questions.length - annulled - noSolutionCount;
  const pct = scored > 0 ? Math.round((correct / scored) * 100) : null;

  return (
    <div className="md:grid md:grid-cols-3 md:gap-6 md:items-start">

      {/* Left: Summary card (sticky on desktop) */}
      <div className="md:col-span-1 md:sticky md:top-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-card dark:border-zinc-700 dark:bg-zinc-900">
          <h1 className="mb-1 text-2xl font-bold text-balance">{title}</h1>
          <p className="mb-6 text-sm text-zinc-400 dark:text-zinc-500">Resultados del examen</p>

          {hasSolutions ? (
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Correctas" value={correct} color="text-emerald-600" />
              <Stat label="Incorrectas" value={wrong} color="text-red-500" />
              <Stat label="Sin responder" value={skipped} color="text-zinc-400" />
              {annulled > 0 && <Stat label="Anuladas" value={annulled} color="text-amber-500" />}
            </div>
          ) : (
            <p className="text-sm text-zinc-400 dark:text-zinc-500">Este examen no tiene soluciones — revisa tus respuestas abajo.</p>
          )}

          {pct !== null && (
            <div className="mt-5">
              <div className="mb-1 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>Aciertos</span>
                <span>{pct}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-700">
                <div
                  className={`h-2 rounded-full transition-all ${pct >= 60 ? 'bg-emerald-500' : 'bg-red-400'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={onRestart}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 active:scale-[0.98] transition"
            >
              Repetir examen
            </button>
            <button
              onClick={onBack}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium hover:bg-zinc-50 active:scale-[0.98] transition dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Otros exámenes
            </button>
          </div>
        </div>
      </div>

      {/* Right: Per-question review */}
      <div className="mt-6 md:col-span-2 md:mt-0">
        <h2 className="mb-4 text-lg font-semibold text-balance">Revisión pregunta por pregunta</h2>
        <div className="space-y-4">
        {questions.map(q => {
          const userAns = answers[q.number];
          const correctAns = solutions?.[q.number];
          const isAnnulled = correctAns === 'nula';
          const noSolution = hasSolutions && correctAns === undefined;
          const isCorrect = hasSolutions && !isAnnulled && !noSolution && userAns === correctAns;
          const isWrong = hasSolutions && !isAnnulled && !noSolution && userAns && userAns !== correctAns;
          const isSkipped = !userAns;

          let borderColor = 'border-zinc-200';
          if (isAnnulled) borderColor = 'border-amber-300';
          else if (noSolution) borderColor = 'border-zinc-200';
          else if (isCorrect) borderColor = 'border-emerald-400';
          else if (isWrong) borderColor = 'border-red-400';
          else if (isSkipped && hasSolutions) borderColor = 'border-zinc-300';

          return (
            <div
              key={q.number}
              className={`rounded-xl border-2 ${borderColor} bg-white p-4 dark:bg-zinc-900`}
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <p className="text-sm font-medium leading-snug">
                  <span className="mr-2 text-zinc-400 dark:text-zinc-500">#{q.number}</span>
                  {q.text}
                </p>
                <Badge isAnnulled={isAnnulled} isCorrect={isCorrect} isWrong={isWrong} isSkipped={isSkipped} noSolution={noSolution} hasSolutions={hasSolutions} />
              </div>

              <ul className="space-y-1">
                {q.options.map(opt => {
                  const isSelected = userAns === opt.letter;
                  const isAnswer = hasSolutions && correctAns === opt.letter && !isAnnulled;

                  let cls = 'border-zinc-100 bg-zinc-50 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400';
                  if (isAnswer && isSelected) cls = 'border-emerald-400 bg-emerald-50 text-emerald-700 font-semibold dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-500';
                  else if (isAnswer) cls = 'border-emerald-300 bg-emerald-50 text-emerald-700 font-semibold dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-400';
                  else if (isSelected && !isAnswer && !noSolution && !isAnnulled) cls = 'border-red-300 bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300 dark:border-red-400';
                  else if (isSelected && (noSolution || isAnnulled)) cls = 'border-indigo-200 bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-400';

                  return (
                    <li key={opt.letter} className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-xs ${cls}`}>
                      <span className="font-bold">{opt.letter.toUpperCase()})</span>
                      <span>{opt.text}</span>
                      {isSelected && !hasSolutions && <span className="ml-auto shrink-0 text-indigo-500">✓ Tu respuesta</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      </div>

    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="rounded-xl bg-zinc-50 p-3 text-center dark:bg-zinc-800">
      <p className={`text-2xl font-bold tabular-nums ${color}`}>{value}</p>
      <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">{label}</p>
    </div>
  );
}

function Badge({ isAnnulled, isCorrect, isWrong, isSkipped, noSolution, hasSolutions }) {
  if (isAnnulled) return <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900 dark:text-amber-300">Anulada</span>;
  if (noSolution) return <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">Sin solución</span>;
  if (isCorrect) return <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">Correcta</span>;
  if (isWrong) return <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900 dark:text-red-300">Incorrecta</span>;
  if (isSkipped && hasSolutions) return <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">Sin responder</span>;
  return null;
}
