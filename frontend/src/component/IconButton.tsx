import "./IconButton.css";

type IconButtonProps = {
  // Symbole affiché dans le bouton (ex: "×")
  icon: string;
  // Description de l'action, lue par les lecteurs d'écran (ex: "Supprimer la quête")
  label: string;
  // Fonction appelée au clic
  onClick: () => void;
};

function IconButton({ icon, label, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      className="icon-button"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  );
}

export default IconButton;
