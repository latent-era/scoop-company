interface CakePreviewProps {
  selectedSize: "small" | "large";
  selectedButtercream: "small" | "full" | "none";
  selectedFlavour: string | null;
  selectedSauces: string[];
  selectedToppings: string[];
}

// Helper to get flavour display name
const getFlavourName = (flavourId: string) => {
  const names: { [key: string]: string } = {
    'vanilla': 'Classic Vanilla',
    'strawberry': 'Strawberry Swirl',
    'pistachio': 'Pistachio Dream',
    'chocolate': 'Belgian Chocolate',
    'mango': 'Mango Sorbet',
    'salted-caramel': 'Salted Caramel',
    'hazelnut': 'Roasted Hazelnut',
    'lemon': 'Zesty Lemon',
    'mint': 'Mint Choc Chip',
    'raspberry': 'Raspberry Ripple',
  };
  return names[flavourId] || flavourId;
};

export function CakePreview({
  selectedSize,
  selectedButtercream,
  selectedFlavour,
  selectedSauces,
  selectedToppings
}: CakePreviewProps) {
  return (
    <div className="sticky top-4">
      {/* Preview details */}
      <div className="bg-white rounded-xl p-4 border-2 border-gray-200 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Size:</span>
          <span className="font-medium text-[#3D2B1F]">
            {selectedSize === 'small' ? 'Small (6-8)' : 'Large (10-12)'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Buttercream:</span>
          <span className="font-medium text-[#3D2B1F]">
            {selectedButtercream === 'small' && 'Small Decorative'}
            {selectedButtercream === 'full' && 'Full Coverage'}
            {selectedButtercream === 'none' && 'None'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Flavour:</span>
          <span className="font-medium text-[#3D2B1F]">
            {selectedFlavour ? getFlavourName(selectedFlavour) : 'Not selected'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Sauces:</span>
          <span className="font-medium text-[#3D2B1F]">
            {selectedSauces.length > 0 ? selectedSauces.length : 'None'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Toppings:</span>
          <span className="font-medium text-[#3D2B1F]">
            {selectedToppings.length > 0 ? selectedToppings.length : 'None'}
          </span>
        </div>
      </div>
    </div>
  );
}
