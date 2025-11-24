import { Check } from "lucide-react";

interface OptionToggleProps {
  name: string;
  allergens?: string[];
  isSelected: boolean;
  onClick: () => void;
}

export function OptionToggle({ name, allergens, isSelected, onClick }: OptionToggleProps) {
  return (
    <button
      onClick={onClick}
      className={`relative px-5 py-4 rounded-xl border-2 transition-all duration-200 text-left shadow-sm hover:scale-[1.02] hover:translate-x-1 active:scale-98 ${
        isSelected
          ? "border-[#2E4E3F] bg-gradient-to-r from-[#2E4E3F]/10 to-[#2E4E3F]/5 shadow-md"
          : "border-[#E3C565]/30 bg-white hover:border-[#E3C565] hover:shadow-md hover:bg-[#FFF8FB]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 mt-0.5 ${
          isSelected ? "border-[#2E4E3F] bg-[#2E4E3F] shadow-sm" : "border-[#E3C565]/40 bg-white"
        }`}>
          {isSelected && (
            <Check className="w-4 h-4 text-white animate-check-in" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`transition-colors ${isSelected ? "text-[#3D2B1F]" : "text-[#3D2B1F]/70"}`}>
            {name}
          </div>
          {allergens && allergens.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {allergens.map((allergen) => (
                <span
                  key={allergen}
                  className={`inline-block px-2 py-0.5 rounded text-xs transition-colors ${
                    isSelected
                      ? "bg-[#2E4E3F]/15 text-[#2E4E3F]"
                      : "bg-[#E3C565]/15 text-[#3D2B1F]/70"
                  }`}
                >
                  {allergen}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
