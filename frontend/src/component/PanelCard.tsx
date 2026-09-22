import type { ReactNode } from "react";
import "./PanelCard.css";

type PanelCardProps = {
  // Titre affiché en haut du panneau
  title: string;
  // Bouton d'action optionnel affiché à droite du titre (ex: un <Button />)
  action?: ReactNode;
  // Contenu du panneau (tout ce qui est écrit entre <PanelCard> et </PanelCard>)
  children: ReactNode;
};

function PanelCard({ title, action, children }: PanelCardProps) {
  return (
    <section className="panel-card">
      <header className="panel-card-header">
        <h2 className="panel-card-title">{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}

export default PanelCard;
