import { CheckCircle, XCircle } from "lucide-react";

export const Badge = ({ status }: { status: "open" | "closed" }) => {
  const variants = {
    open: "bg-green-900/30 text-green-400 border-green-500",
    closed: "bg-red-900/30 text-red-400 border-red-500",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full border ${variants[status]} inline-flex items-center gap-1`}
    >
      {status === "open" ? (
        <>
          <CheckCircle size={12} />
          <span>Aberta</span>
        </>
      ) : (
        <>
          <XCircle size={12} />
          <span>Fechada</span>
        </>
      )}
    </span>
  );
};
