import type { QuestStatus } from "../frontdto/quest";
import "./StatusBadge.css";

type StatusBadgeProps = {
  status: QuestStatus;
};

function StatusBadge({ status }: StatusBadgeProps) {
  const labels = {
    AVAILABLE: "disponible",
    IN_PROGRESS: "en cours",
    COMPLETED: "terminée",
  };

  return (
    <span className={`badge badge-${status.toLowerCase()}`}>{labels[status]}</span>
  );
}

export default StatusBadge;