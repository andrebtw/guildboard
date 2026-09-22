import type { AdventurerCreateDto, AdventurerResponseDto } from "../frontdto/adventurer";
import type { ApiError } from "../frontdto/ApiError";
import type { AssignmentResponseDto } from "../frontdto/assignment";

const BASE_URL = "http://localhost:8080/api/adventurers";

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

async function getAll(): Promise<AdventurerResponseDto[]> {
  // 1er await : attend les en-têtes de la réponse (le corps n'est pas encore lu)
  const response = await fetch(BASE_URL);
  await ensureOk(response);
  // 2e await : attend la lecture complète du corps et son parsing JSON
  return response.json();
}

async function getById(id: number): Promise<AdventurerResponseDto> {
  const response = await fetch(`${BASE_URL}/${id}`);
  await ensureOk(response);
  return response.json();
}

async function create(dto: AdventurerCreateDto): Promise<AdventurerResponseDto> {
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

async function update(id: number, dto: AdventurerCreateDto): Promise<AdventurerResponseDto> {
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

async function getHistory(id: number): Promise<AssignmentResponseDto[]> {
  const response = await fetch(`${BASE_URL}/${id}/history`);
  await ensureOk(response);
  return response.json();
}

export default { getAll, getById, create, update, remove, getHistory };
