import { useState, useEffect } from 'react';
import { listExams, loadExam } from '../examLoader.js';

function unique(arr) { return [...new Set(arr.filter(Boolean))].sort(); }

function FilterBar({ label, options, active, toggle }) {
  if (!options.length) return null;
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest">{label}</span>
      <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => toggle(opt)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition border ${
            active.includes(opt)
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-zinc-600 border-zinc-200 hover:border-indigo-300'
          }`}
        >
          {opt}
        </button>
      ))}
      </div>
    </div>
  );
}

export default function ExamList({ onSelect }) {
  const [exams, setExams] = useState([]);
  const [error, setError] = useState(null);
  const [starting, setStarting] = useState(null);
  const [filters, setFilters] = useState({ exam: [], region: [], year: [], type: [] });

  useEffect(() => {
    listExams().then(setExams).catch(() => setError('No se pudieron cargar los exámenes.'));
  }, []);

  function toggle(dim, value) {
    setFilters(prev => ({
      ...prev,
      [dim]: prev[dim].includes(value) ? prev[dim].filter(v => v !== value) : [...prev[dim], value],
    }));
  }

  const examsWithMeta = exams.filter(e => e.exam);
  const standalone = exams.filter(e => !e.exam);

  const filtered = examsWithMeta.filter(e =>
    (!filters.exam.length   || filters.exam.includes(e.exam)) &&
    (!filters.region.length || filters.region.includes(e.region)) &&
    (!filters.year.length   || filters.year.includes(e.year)) &&
    (!filters.type.length   || filters.type.includes(e.type))
  );

  const hasFilters = Object.values(filters).some(f => f.length);

  async function handleSelect(name) {
    setStarting(name);
    try {
      const data = await loadExam(name);
      onSelect(data);
    } catch {
      setError('No se pudo cargar el examen.');
    } finally {
      setStarting(null);
    }
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Exámenes disponibles</h1>
      <p className="mb-6 text-zinc-500">Selecciona un examen para practicar</p>

      <div className="md:grid md:grid-cols-3 md:gap-6 md:items-start">

        {/* Left: Filters */}
        {examsWithMeta.length > 0 && (
          <div className="mb-6 md:mb-0 md:col-span-1">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm space-y-4">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Filtros</p>
              <FilterBar label="Oposición" options={unique(examsWithMeta.map(e => e.exam))}   active={filters.exam}   toggle={v => toggle('exam', v)} />
              <FilterBar label="Región"    options={unique(examsWithMeta.map(e => e.region))} active={filters.region} toggle={v => toggle('region', v)} />
              <FilterBar label="Año"       options={unique(examsWithMeta.map(e => e.year))}   active={filters.year}   toggle={v => toggle('year', v)} />
              <FilterBar label="Tipo"      options={unique(examsWithMeta.map(e => e.type))}   active={filters.type}   toggle={v => toggle('type', v)} />
              {hasFilters && (
                <button onClick={() => setFilters({ exam: [], region: [], year: [], type: [] })} className="text-xs text-indigo-500 hover:underline">
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right: Exam list */}
        <div className={examsWithMeta.length > 0 ? 'md:col-span-2' : 'md:col-span-3'}>
          {exams.length === 0 && <p className="text-zinc-400">No hay exámenes disponibles.</p>}
          <ul className="space-y-3">
            {filtered.map(exam => (
              <ExamCard key={exam.name} exam={exam} starting={starting} onSelect={handleSelect} />
            ))}
            {standalone.map(exam => (
              !hasFilters && <ExamCard key={exam.name} exam={exam} starting={starting} onSelect={handleSelect} />
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}

function ExamCard({ exam, starting, onSelect }) {
  return (
    <li>
      <button
        onClick={() => onSelect(exam.name)}
        disabled={starting === exam.name}
        className="group flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-5 py-4 text-left shadow-sm transition hover:border-indigo-400 hover:shadow-md disabled:opacity-60"
      >
        <div className="min-w-0">
          <p className="font-semibold group-hover:text-indigo-600 transition-colors">
            {exam.title}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {exam.exam   && <Badge>{exam.exam}</Badge>}
            {exam.region && <Badge>{exam.region}</Badge>}
            {exam.year   && <Badge>{exam.year}</Badge>}
            {exam.type   && <Badge color={exam.type === 'Ordinaria' ? 'blue' : 'amber'}>{exam.type}</Badge>}
            <Badge color={exam.hasSolution ? 'emerald' : 'zinc'}>
              {exam.hasSolution ? 'Con soluciones' : 'Sin soluciones'}
            </Badge>
          </div>
        </div>
        <span className="ml-4 shrink-0 text-zinc-300 group-hover:text-indigo-400 transition-colors text-lg">→</span>
      </button>
    </li>
  );
}

function Badge({ children, color = 'zinc' }) {
  const cls = {
    zinc:    'bg-zinc-100 text-zinc-500',
    emerald: 'bg-emerald-100 text-emerald-700',
    blue:    'bg-blue-100 text-blue-700',
    amber:   'bg-amber-100 text-amber-700',
    indigo:  'bg-indigo-100 text-indigo-700',
  }[color];
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{children}</span>;
}
