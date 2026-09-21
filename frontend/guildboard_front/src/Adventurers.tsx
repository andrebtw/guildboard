import { useState, useEffect } from "react";

interface Adventurer {
  id: number;
  name: string;
  level: number;
  characterClass: string;
}

function Adventurers() {
  const [adventurers, setAdventurers] = useState<Adventurer[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/adventurers")
      .then((response) => response.json())
      .then((data) => setAdventurers(data));
  }, []);

  const handleEdit = (adventurer: Adventurer) => {
    console.log("Edit: ", adventurer.name);
  };

  const handleDelete = (adventurer: Adventurer) => {

    console.log("Deleted:", adventurer.name);
  };

  return (
    <div>
      <h1>Adventuriers</h1>

      {adventurers.map((adv) => (
        
        <p key={adv.id}>
          <hr/>
          Nom: {adv.name}<br/>
          Niveau: {adv.level}<br/> 
          Classe: {adv.characterClass}
          <button onClick={() => handleEdit(adv)}>Modifier</button>
          <button onClick={() => handleDelete(adv)}>Supprimer</button>
        </p>
      ))}
    <hr/>
    </div>
  );
}

export default Adventurers;