import "./EmptyState.css";

type EmptyStateProps = {
  // Message affiché quand la liste est vide (ex: "Aucune quête pour le moment")
  message: string;
};

function EmptyState({ message }: EmptyStateProps) {
  return <p className="empty-state">{message}</p>;
}

export default EmptyState;
