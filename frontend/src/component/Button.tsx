import "./Button.css";

type ButtonProps = {
  label: string;
  color: "primary" | "danger" | "neutral";
  onClick: () => void;
};

function Button({ label, color, onClick }: ButtonProps) {
  return (
    <button className={`btn btn-${color}`} onClick={onClick}>
      {label}
    </button>
  );
}

export default Button;