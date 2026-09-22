import type { ApiError } from "../frontdto/ApiError";
import type { Difficulty, QuestCreateDto, QuestResponseDto, QuestStatus } from "../frontdto/quest";

const BASE_URL = "http://localhost:8080/api/quests";

// Vérifie la réponse HTTP : si le serveur a répondu 4xx/5xx, on lève l'erreur de l'API
async function ensureOk(response: Response): Promise<void> {
  // response.ok vaut true pour les statuts 200 à 299
  if (response.ok) {
    return;
  }

  let error: ApiError;
  try {
    // Le backend renvoie un JSON { status, code, message } ; .json() est asynchrone, donc await
    error = await response.json();
  } catch {
    // Le corps n'est pas du JSON (ex: page d'erreur du serveur) : on fabrique un ApiError de secours
    error = { status: response.status, code: "UNKNOWN", message: response.statusText };
  }

  // On lève l'objet ApiError lui-même : le composant qui appelle le récupère dans son catch
  throw error;
}

async function getAll(status?: QuestStatus, difficulty?: Difficulty): Promise<QuestResponseDto[]> {
  // URLSearchParams construit et encode proprement la partie "?clé=valeur&clé=valeur"
  const params = new URLSearchParams();
  if (status) {
    params.set("status", status);
  }
  if (difficulty) {
    params.set("difficulty", difficulty);
  }

  // Sans filtre, toString() renvoie "" : on n'ajoute alors pas de "?" du tout
  const query = params.toString();
  const url = query ? `${BASE_URL}?${query}` : BASE_URL;

  // 1er await : attend les en-têtes de la réponse (le corps n'est pas encore lu)
  const response = await fetch(url);
  await ensureOk(response);
  // 2e await : attend la lecture complète du corps et son parsing JSON
  return response.json();
}

async function getById(id: number): Promise<QuestResponseDto> {
  const response = await fetch(`${BASE_URL}/${id}`);
  await ensureOk(response);
  return response.json();
}

async function create(dto: QuestCreateDto): Promise<QuestResponseDto> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    // Indique au backend que le corps est du JSON (sinon @RequestBody échoue)
    headers: { "Content-Type": "application/json" },
    // Le corps d'une requête doit être une chaîne : on sérialise l'objet en JSON
    body: JSON.stringify(dto),
  });
  await ensureOk(response);
  return response.json();
}

async function update(id: number, dto: QuestCreateDto): Promise<QuestResponseDto> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  await ensureOk(response);
  return response.json();
}

async function remove(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  // Pas de .json() ici : le backend renvoie un corps vide pour un DELETE
  await ensureOk(response);
}

export default { getAll, getById, create, update, remove };
