import { useI18n } from "@/contexts/I18nContext";

export type Status = "pending" | "contacted" | "offer_sent" | "accepted" | "converted" | "expired" | "rejected" | "paid" | "cancelled" | "preparing" | "shipped" | "delivered";

const STATUS_CONFIG: Record<Status, { color: string }> = {
  pending: { color: "bg-yellow-100 text-yellow-800" },
  contacted: { color: "bg-blue-100 text-blue-800" },
  offer_sent: { color: "bg-green-100 text-green-800" },
  accepted: { color: "bg-emerald-100 text-emerald-800" },
  converted: { color: "bg-purple-100 text-purple-800" },
  expired: { color: "bg-gray-100 text-gray-500" },
  rejected: { color: "bg-red-100 text-red-800" },
  paid: { color: "bg-green-100 text-green-800" },
  cancelled: { color: "bg-red-100 text-red-800" },
  preparing: { color: "bg-yellow-100 text-yellow-800" },
  shipped: { color: "bg-blue-100 text-blue-800" },
  delivered: { color: "bg-green-100 text-green-800" },
};

const StatusBadge = ({ status }: { status: Status }) => {
  const { t } = useI18n();
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${config.color}`}>
      {t(`status.${status}`)}
    </span>
  );
};

export default StatusBadge;
