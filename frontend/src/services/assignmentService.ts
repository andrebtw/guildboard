import type { ApiError } from "../frontdto/ApiError";
import type { AssignmentCreateDto, AssignmentResponseDto } from "../frontdto/assignment";
import type { QuestResponseDto } from "../frontdto/quest";

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

// Assigne un aventurier à une quête ; le backend peut répondre 422 (niveau trop bas, aventurier occupé...)
async function assign(questId: number, dto: AssignmentCreateDto): Promise<AssignmentResponseDto> {
  const response = await fetch(`${BASE_URL}/${questId}/assignment`, {
    method: "POST",
    // Indique au backend que le corps est du JSON (sinon @RequestBody échoue)
    headers: { "Content-Type": "application/json" },
    // Le corps d'une requête doit être une chaîne : on sérialise l'objet en JSON
    body: JSON.stringify(dto),
  });
  await ensureOk(response);
  // Lecture asynchrone du corps de la réponse et parsing JSON (2e await du parcours)
  return response.json();
}

// Termine une quête : le backend crédite l'or et l'xp puis renvoie la quête mise à jour
async function complete(questId: number): Promise<QuestResponseDto> {
  // POST sans corps : l'identifiant de la quête suffit, il est dans l'URL
  const response = await fetch(`${BASE_URL}/${questId}/completion`, { method: "POST" });
  await ensureOk(response);
  return response.json();
}

export default { assign, complete };
