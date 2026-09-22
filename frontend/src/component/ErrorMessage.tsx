import type { ApiError } from "../frontdto/ApiError";
import "./ErrorMessage.css";

type ErrorMessageProps = {
  // Erreur renvoyée par l'API (status HTTP, code métier et message)
  error: ApiError;
};

function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <div className="error-message" role="alert">
      <span className="error-message-code">
        Erreur {error.status} ({error.code})
      </span>
      <p>{error.message}</p>
    </div>
  );
}

export default ErrorMessage;
