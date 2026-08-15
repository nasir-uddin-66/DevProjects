// EmptyState component for displaying empty states

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  message = "No data available",
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-[#30ce67]">
      {icon || <i className="fa-solid fa-inbox text-4xl mb-4"></i>}
      <p className="text-lg font-semibold">{message}</p>
    </div>
  );
}
