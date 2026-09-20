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

  return (
    <div>
      <h1>Adventuriers</h1>

      {adventurers.map((adv) => (
        
        <p key={adv.id}>
          <hr/>
          Nom: {adv.name}<br/>
          Niveau: {adv.level}<br/> 
          Classe: {adv.characterClass}<br/>
        </p>
      ))}
    <hr/>
    </div>
  );
}

export default Adventurers;