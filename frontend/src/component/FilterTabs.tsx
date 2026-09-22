import "./FilterTabs.css";

type FilterOption<T extends string> = {
  // Valeur technique de l'option (ex: "AVAILABLE")
  value: T;
  // Texte affiché dans l'onglet (ex: "Disponibles")
  label: string;
};

type FilterTabsProps<T extends string> = {
  // Liste des onglets à afficher
  options: FilterOption<T>[];
  // Valeur de l'onglet actuellement sélectionné
  selected: T;
  // Fonction appelée avec la valeur de l'onglet sur lequel on clique
  onChange: (value: T) => void;
  // Description du groupe d'onglets, lue par les lecteurs d'écran
  label: string;
};

function FilterTabs<T extends string>({
  options,
  selected,
  onChange,
  label,
}: FilterTabsProps<T>) {
  return (
    <div className="filter-tabs" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`filter-tab ${option.value === selected ? "filter-tab-active" : ""}`}
          aria-pressed={option.value === selected}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default FilterTabs;
