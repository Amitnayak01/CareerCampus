export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className={`${sizes[size]} border-4 border-brand-200 dark:border-brand-900 border-t-brand-500 rounded-full animate-spin`} />
      {text && <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{text}</p>}
    </div>
  );
}
