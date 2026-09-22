import { useEffect, useState } from "react";
import type { ApiError } from "../frontdto/ApiError";
import type { AdventurerResponseDto } from "../frontdto/adventurer";
import type { Difficulty, QuestResponseDto, QuestStatus } from "../frontdto/quest";
import Button from "../component/Button";
import DifficultyBadge from "../component/DifficultyBadge";
import EmptyState from "../component/EmptyState";
import ErrorMessage from "../component/ErrorMessage";
import FilterTabs from "../component/FilterTabs";
import PanelCard from "../component/PanelCard";
import StatusBadge from "../component/StatusBadge";
import adventurerService from "../services/adventurerService";
import assignmentService from "../services/assignmentService";
import questService from "../services/questService";
import { toApiError } from "./apiError";
import QuestForm from "./QuestForm";
import "./QuestsPage.css";

// "ALL" = pas de filtre (les services attendent undefined dans ce cas)
type StatusFilter = QuestStatus | "ALL";
type DifficultyFilter = Difficulty | "ALL";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "Toutes" },
  { value: "AVAILABLE", label: "Disponibles" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "COMPLETED", label: "Terminées" },
];

const DIFFICULTY_OPTIONS: { value: DifficultyFilter; label: string }[] = [
  { value: "ALL", label: "Toutes" },
  { value: "EASY", label: "Facile" },
  { value: "MEDIUM", label: "Moyenne" },
  { value: "HARD", label: "Difficile" },
  { value: "EPIC", label: "Épique" },
];

function QuestsPage() {
  // Quêtes affichées (résultat du dernier appel questService.getAll)
  const [quests, setQuests] = useState<QuestResponseDto[]>([]);
  // Aventuriers proposés dans les listes déroulantes d'assignation
  const [adventurers, setAdventurers] = useState<AdventurerResponseDto[]>([]);
  // Filtre de statut choisi ; le changer relance le chargement des quêtes
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  // Filtre de difficulté choisi ; le changer relance le chargement des quêtes
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("ALL");
  // true tant que la liste des quêtes est en cours de chargement
  const [loading, setLoading] = useState(true);
  // Erreur de chargement de la liste (remplace la liste à l'écran)
  const [error, setError] = useState<ApiError | null>(null);
  // Erreur d'une action (assigner / compléter), ex: 422 LEVEL_TOO_LOW ; la liste reste affichée
  const [actionError, setActionError] = useState<ApiError | null>(null);
  // Affiche ou masque le formulaire de création
  const [showForm, setShowForm] = useState(false);
  // Aventurier choisi dans le select de chaque quête, indexé par id de quête (valeur du <select> = texte)
  const [selectedByQuest, setSelectedByQuest] = useState<Record<number, string>>({});
  // Id de la quête dont une action est en cours (évite les doubles clics), null si aucune
  const [pendingQuestId, setPendingQuestId] = useState<number | null>(null);
  // Compteur qu'on incrémente pour forcer les useEffect à recharger les données après une modification
  const [reloadKey, setReloadKey] = useState(0);

  // Charge les quêtes : se déclenche au premier affichage, à chaque changement de filtre
  // et à chaque incrément de reloadKey (après création, assignation ou complétion)
  useEffect(() => {
    // Passe à true au démontage/changement de filtre : une réponse tardive ne doit plus écrire dans le state
    let cancelled = false;

    async function loadQuests() {
      setLoading(true);
      setError(null);
      try {
        const data = await questService.getAll(
          statusFilter === "ALL" ? undefined : statusFilter,
          difficultyFilter === "ALL" ? undefined : difficultyFilter,
        );
        if (cancelled) {
          return;
        }
        // Le backend n'applique qu'un seul filtre (le statut passe avant la difficulté) :
        // on refiltre donc la difficulté ici pour que les deux filtres marchent ensemble
        setQuests(
          difficultyFilter === "ALL" ? data : data.filter((q) => q.difficulty === difficultyFilter),
        );
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

    void loadQuests();
    // Fonction de nettoyage : React l'appelle avant de relancer l'effet ou au démontage
    return () => {
      cancelled = true;
    };
  }, [statusFilter, difficultyFilter, reloadKey]);

  // Charge les aventuriers pour les selects : au premier affichage puis après chaque modification
  // (une complétion change leur niveau, affiché dans le select)
  useEffect(() => {
    let cancelled = false;

    async function loadAdventurers() {
      try {
        const data = await adventurerService.getAll();
        if (!cancelled) {
          setAdventurers(data);
        }
      } catch (e) {
        if (!cancelled) {
          setActionError(toApiError(e));
        }
      }
    }

    void loadAdventurers();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  async function handleAssign(questId: number, adventurerId: number) {
    if (pendingQuestId !== null) {
      return;
    }
    setPendingQuestId(questId);
    setActionError(null);
    try {
      await assignmentService.assign(questId, { adventurerId });
      // Recharge la liste : la quête passe à IN_PROGRESS
      setReloadKey((key) => key + 1);
    } catch (e) {
      // Erreurs métier 422 (niveau trop bas, aventurier occupé...) affichées telles que renvoyées par le back
      setActionError(toApiError(e));
    } finally {
      setPendingQuestId(null);
    }
  }

  async function handleComplete(questId: number) {
    if (pendingQuestId !== null) {
      return;
    }
    setPendingQuestId(questId);
    setActionError(null);
    try {
      await assignmentService.complete(questId);
      setReloadKey((key) => key + 1);
    } catch (e) {
      setActionError(toApiError(e));
    } finally {
      setPendingQuestId(null);
    }
  }

  function handleCreated() {
    setShowForm(false);
    setReloadKey((key) => key + 1);
  }

  function renderList() {
    if (loading) {
      return <p role="status">Chargement des quêtes...</p>;
    }
    if (error) {
      return <ErrorMessage error={error} />;
    }
    if (quests.length === 0) {
      return <EmptyState message="Aucune quête ne correspond à ces filtres." />;
    }

    return (
      <ul className="card-grid quest-list">
        {quests.map((quest) => {
          // Sans choix explicite, le select propose le premier aventurier de la liste
          const selectedId = selectedByQuest[quest.id] ?? String(adventurers[0]?.id ?? "");

          return (
            <li key={quest.id}>
              <PanelCard title={quest.title} action={<DifficultyBadge difficulty={quest.difficulty} />}>
                <div className="quest-meta">
                  <StatusBadge status={quest.status} />
                  <span>Niveau requis : {quest.requiredLevel}</span>
                </div>
                <p className="quest-description">{quest.description}</p>
                <p className="quest-rewards">
                  Récompense : {quest.goldReward} or, {quest.xpReward} XP
                </p>

                {quest.status === "AVAILABLE" &&
                  (adventurers.length === 0 ? (
                    <p>Aucun aventurier disponible : crée-en un d'abord.</p>
                  ) : (
                    <div className="quest-actions">
                      <div className="quest-assign-field">
                        <label htmlFor={`assign-${quest.id}`}>Aventurier</label>
                        <select
                          id={`assign-${quest.id}`}
                          value={selectedId}
                          onChange={(event) =>
                            setSelectedByQuest((previous) => ({
                              ...previous,
                              [quest.id]: event.target.value,
                            }))
                          }
                        >
                          {adventurers.map((adventurer) => (
                            <option key={adventurer.id} value={adventurer.id}>
                              {adventurer.name} (niv. {adventurer.level})
                            </option>
                          ))}
                        </select>
                      </div>
                      <Button
                        label="Assigner"
                        color="primary"
                        onClick={() => void handleAssign(quest.id, Number(selectedId))}
                      />
                    </div>
                  ))}

                {quest.status === "IN_PROGRESS" && (
                  <div className="quest-actions">
                    <Button
                      label="Terminer la quête"
                      color="primary"
                      onClick={() => void handleComplete(quest.id)}
                    />
                  </div>
                )}
              </PanelCard>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Quêtes</h1>
        <Button
          label={showForm ? "Fermer" : "+ Créer"}
          color="primary"
          onClick={() => setShowForm((visible) => !visible)}
        />
      </header>

      {showForm && <QuestForm onCreated={handleCreated} onCancel={() => setShowForm(false)} />}

      <div className="filters">
        <FilterTabs
          label="Filtrer par statut"
          options={STATUS_OPTIONS}
          selected={statusFilter}
          onChange={setStatusFilter}
        />
        <FilterTabs
          label="Filtrer par difficulté"
          options={DIFFICULTY_OPTIONS}
          selected={difficultyFilter}
          onChange={setDifficultyFilter}
        />
      </div>

      {actionError && <ErrorMessage error={actionError} />}

      {renderList()}
    </div>
  );
}

export default QuestsPage;
