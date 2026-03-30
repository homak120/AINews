interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-3xl mb-3 opacity-40">○</div>
      <p className="text-slate-500 text-sm">{message}</p>
    </div>
  );
}
