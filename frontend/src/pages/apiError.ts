import type { ApiError } from "../frontdto/ApiError";

// Transforme n'importe quelle valeur attrapée dans un catch (type unknown) en ApiError affichable
export function toApiError(error: unknown): ApiError {
  if (typeof error === "object" && error !== null) {
    // Cast vers Partial : on ne sait pas encore si tous les champs sont présents
    const candidate = error as Partial<ApiError>;
    // Un objet avec un status numérique vient forcément d'une réponse HTTP du backend (via ensureOk)
    if (typeof candidate.status === "number") {
      return {
        status: candidate.status,
        code: candidate.code || "UNKNOWN",
        message: candidate.message || "Une erreur inattendue est survenue.",
      };
    }
  }
  // Sinon fetch lui-même a échoué (serveur éteint, réseau coupé) : aucune réponse HTTP n'existe
  return {
    status: 0,
    code: "NETWORK_ERROR",
    message: "Impossible de joindre le serveur. Vérifie qu'il est démarré.",
  };
}
