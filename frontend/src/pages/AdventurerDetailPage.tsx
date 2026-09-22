import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { ApiError } from "../frontdto/ApiError";
import type { AdventurerResponseDto } from "../frontdto/adventurer";
import type { AssignmentResponseDto } from "../frontdto/assignment";
import Avatar from "../component/Avatar";
import EmptyState from "../component/EmptyState";
import ErrorMessage from "../component/ErrorMessage";
import PanelCard from "../component/PanelCard";
import ProgressBar from "../component/ProgressBar";
import StatusBadge from "../component/StatusBadge";
import adventurerService from "../services/adventurerService";
import questService from "../services/questService";
import { toApiError } from "./apiError";
import { CLASS_LABELS } from "./labels";
import "./AdventurerDetailPage.css";

// Règle du backend (AssignmentService.complete) : seuil d'XP pour passer au niveau suivant = niveau * 150
const XP_PER_LEVEL = 150;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
}

function AdventurerDetailPage() {
  // L'id vient de l'URL /adventurers/:id ; useParams le renvoie toujours sous forme de texte
  const { id } = useParams<{ id: string }>();
  const adventurerId = Number(id);
  const invalidId = !Number.isInteger(adventurerId);

  // Aventurier affiché (null tant qu'il n'est pas chargé)
  const [adventurer, setAdventurer] = useState<AdventurerResponseDto | null>(null);
  // Historique des assignations de cet aventurier
  const [history, setHistory] = useState<AssignmentResponseDto[]>([]);
  // Titres des quêtes indexés par id : l'historique ne contient que des questId
  const [questTitles, setQuestTitles] = useState<Record<number, string>>({});
  // true tant que les données sont en cours de chargement
  const [loading, setLoading] = useState(true);
  // Erreur de chargement (remplace le contenu de la page)
  const [error, setError] = useState<ApiError | null>(null);

  // Charge l'aventurier, son historique et les titres des quêtes en parallèle.
  // Se déclenche au premier affichage et à chaque changement d'id dans l'URL (navigation entre deux fiches).
  useEffect(() => {
    if (invalidId) {
      return;
    }
    // Passe à true au démontage/changement d'id : une réponse tardive ne doit plus écrire dans le state
    let cancelled = false;

    async function loadDetail() {
      setLoading(true);
      setError(null);
      try {
        // Promise.all lance les trois appels en même temps et attend que tous soient terminés
        const [adventurerData, historyData, quests] = await Promise.all([
          adventurerService.getById(adventurerId),
          adventurerService.getHistory(adventurerId),
          questService.getAll(),
        ]);
        if (cancelled) {
          return;
        }
        setAdventurer(adventurerData);
        // Plus récent en premier (les dates ISO se comparent correctement comme du texte)
        setHistory([...historyData].sort((a, b) => b.assignedAt.localeCompare(a.assignedAt)));
        setQuestTitles(Object.fromEntries(quests.map((quest) => [quest.id, quest.title])));
      } catch (e) {
        if (!cancelled) {
          setError(toApiError(e));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDetail();
    // Fonction de nettoyage : React l'appelle avant de relancer l'effet ou au démontage
    return () => {
      cancelled = true;
    };
  }, [adventurerId, invalidId]);

  function renderContent() {
    if (invalidId) {
      return (
        <ErrorMessage
          error={{ status: 400, code: "INVALID_ID", message: "L'identifiant de l'aventurier est invalide." }}
        />
      );
    }
    if (loading) {
      return <p role="status">Chargement de l'aventurier...</p>;
    }
    if (error) {
      return <ErrorMessage error={error} />;
    }
    if (!adventurer) {
      return null;
    }

    const xpThreshold = adventurer.level * XP_PER_LEVEL;
    const xpPercent = (adventurer.xp / xpThreshold) * 100;

    return (
      <>
        <PanelCard title={adventurer.name}>
          <div className="detail-identity">
            <Avatar name={adventurer.name} />
            <span>{CLASS_LABELS[adventurer.characterClass]}</span>
          </div>
          <ul className="detail-stats">
            <li>Niveau : {adventurer.level}</li>
            <li>Or : {adventurer.gold}</li>
          </ul>
          <div className="detail-xp">
            <span>
              XP : {adventurer.xp} / {xpThreshold} pour le niveau {adventurer.level + 1}
            </span>
            <ProgressBar percent={xpPercent} label={`Progression vers le niveau ${adventurer.level + 1}`} />
          </div>
        </PanelCard>

        <PanelCard title="Historique des quêtes">
          {history.length === 0 ? (
            <EmptyState message="Cet aventurier n'a encore pris aucune quête." />
          ) : (
            <ul className="history-list">
              {history.map((assignment) => (
                <li key={assignment.id} className="history-item">
                  <span className="history-title">
                    {questTitles[assignment.questId] ?? `Quête n°${assignment.questId}`}
                  </span>
                  {/* completedAt null = pas encore terminée */}
                  <StatusBadge status={assignment.completedAt === null ? "IN_PROGRESS" : "COMPLETED"} />
                  <span className="history-dates">
                    Prise le {formatDate(assignment.assignedAt)}
                    {assignment.completedAt !== null && `, terminée le ${formatDate(assignment.completedAt)}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </PanelCard>
      </>
    );
  }

  return (
    <div className="page">
      <Link className="back-link" to="/adventurers">
        ← Retour aux aventuriers
      </Link>
      {renderContent()}
    </div>
  );
}

export default AdventurerDetailPage;
