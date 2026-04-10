interface CatalogFiltersProps {
  selectedGamme: "all" | "ecocup" | "prestige";
  onGammeChange: (gamme: "all" | "ecocup" | "prestige") => void;
  selectedCapacity: string | null;
  onCapacityChange: (capacity: string | null) => void;
  capacities: string[];
  resultCount: number;
}

const CatalogFilters = ({
  selectedGamme,
  onGammeChange,
  selectedCapacity,
  onCapacityChange,
  capacities,
  resultCount,
}: CatalogFiltersProps) => {
  const gammes = [
    { value: "all" as const, label: "Toutes les gammes" },
    { value: "ecocup" as const, label: "Ecocup" },
    { value: "prestige" as const, label: "Prestige" },
  ];

  return (
    <div className="space-y-4">
      {/* Gamme filter */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-2">
          Gamme
        </p>
        <div className="flex flex-wrap gap-2">
          {gammes.map((g) => (
            <button
              key={g.value}
              onClick={() => onGammeChange(g.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedGamme === g.value
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Capacity filter */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold mb-2">
          Contenance
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCapacityChange(null)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCapacity === null
                ? "bg-foreground text-background"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            Toutes
          </button>
          {capacities.map((cap) => (
            <button
              key={cap}
              onClick={() => onCapacityChange(cap)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCapacity === cap
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {cap}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-muted-foreground pt-1">
        {resultCount} produit{resultCount > 1 ? "s" : ""} trouvé{resultCount > 1 ? "s" : ""}
      </p>
    </div>
  );
};

export default CatalogFilters;
