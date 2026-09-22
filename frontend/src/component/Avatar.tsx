import "./Avatar.css";

type AvatarProps = {
  // Nom de l'aventurier : sa première lettre est affichée dans le cercle
  name: string;
};

function Avatar({ name }: AvatarProps) {
  const initial = name.trim().charAt(0);

  return (
    <span className="avatar" role="img" aria-label={`Avatar de ${name}`}>
      {initial}
    </span>
  );
}

export default Avatar;
