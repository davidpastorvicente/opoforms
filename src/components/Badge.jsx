const COLORS = {
  zinc:    'bg-zinc-100 text-zinc-500',
  emerald: 'bg-emerald-100 text-emerald-700',
  amber:   'bg-amber-100 text-amber-700',
  indigo:  'bg-indigo-100 text-indigo-700',
  blue:    'bg-blue-100 text-blue-700',
};

export default function Badge({ children, color = 'zinc' }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${COLORS[color]}`}>
      {children}
    </span>
  );
}
