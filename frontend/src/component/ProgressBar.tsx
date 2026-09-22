import "./ProgressBar.css";

type ProgressBarProps = {
  // Pourcentage de progression, entre 0 et 100 (les valeurs hors limites sont ramenées dans cet intervalle)
  percent: number;
  // Description lue par les lecteurs d'écran (ex: "Progression de l'expérience")
  label: string;
};

function ProgressBar({ percent, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
    >
      <div className="progress-bar-fill" style={{ width: `${clamped}%` }} />
    </div>
  );
}

export default ProgressBar;
