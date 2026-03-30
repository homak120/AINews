interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-4xl mb-4">⚠️</div>
      <p className="text-slate-400 text-sm max-w-sm">{message}</p>
    </div>
  );
}
