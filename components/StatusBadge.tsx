import { STATUS_LABEL, type ProductStatus } from "@/lib/types";

const styles: Record<ProductStatus, string> = {
  available: "bg-mint/15 text-mint border-mint/30",
  reserved: "bg-amber/15 text-amber border-amber/30",
  installment: "bg-sky/15 text-sky border-sky/30",
  sold: "bg-rose/10 text-rose border-rose/25",
};

export default function StatusBadge({ status, className = "" }: { status: ProductStatus; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${styles[status]} ${className}`}>
      <span aria-hidden>●</span> {STATUS_LABEL[status]}
    </span>
  );
}
