const COLORS = {
  zinc:    'bg-zinc-100 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-300',
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  amber:   'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  indigo:  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
  blue:    'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
};

export default function Badge({ children, color = 'zinc' }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${COLORS[color]}`}>
      {children}
    </span>
  );
}
