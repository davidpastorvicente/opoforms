import { useEffect, useState } from 'react';

export default function ExamList({ onSelect }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [starting, setStarting] = useState(null);

  useEffect(() => {
    fetch('/api/exams')
      .then(r => r.json())
      .then(setExams)
      .catch(() => setError('No se pudieron cargar los exámenes.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleSelect(name) {
    setStarting(name);
    try {
      const res = await fetch(`/api/exams/${name}`);
      const data = await res.json();
      onSelect(data);
    } catch {
      setError('No se pudo cargar el examen.');
    } finally {
      setStarting(null);
    }
  }

  if (loading) return <Skeleton />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Exámenes disponibles</h1>
      <p className="mb-8 text-zinc-500">Selecciona un examen para practicar.</p>

      {exams.length === 0 && (
        <p className="text-zinc-400">No hay exámenes en la carpeta <code>exams/</code>.</p>
      )}

      <ul className="space-y-3">
        {exams.map(exam => (
          <li key={exam.name}>
            <button
              onClick={() => handleSelect(exam.name)}
              disabled={starting === exam.name}
              className="group flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-5 py-4 text-left shadow-sm transition hover:border-indigo-400 hover:shadow-md disabled:opacity-60"
            >
              <div>
                <p className="font-semibold group-hover:text-indigo-600 transition-colors">
                  {exam.name}
                </p>
                <p className="mt-0.5 text-sm text-zinc-400">
                  {exam.hasSolution ? 'Con soluciones' : 'Sin soluciones'}
                </p>
              </div>
              <span className="ml-4 text-zinc-300 group-hover:text-indigo-400 transition-colors text-lg">
                →
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-16 rounded-xl bg-zinc-200" />
      ))}
    </div>
  );
}
