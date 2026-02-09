import { Card } from "./ui/card";
import { Sparkles } from "lucide-react";

const menuItems = [
  {
    name: "Scoops Made to Share 🍨",
    description: "Our signature gelato — perfect for splitting on date night. Rich flavours, smooth textures, and made fresh daily.",
    image: "/images/gelato-share.jpg",
    color: "#F8AFC8",
    emoji: "🍨",
    doodle: "💕"
  },
  {
    name: "Chocolate-Heavy Favourites 🍫",
    description: "For the chocolate lovers — indulgent, decadent, and absolutely worth it. Because Valentine's demands chocolate.",
    image: "/images/chocolate-dessert.jpg",
    color: "#D4526E",
    emoji: "🍫",
    doodle: "💖"
  },
  {
    name: "Cosy Hot Drinks ☕",
    description: "Rich hot chocolate, creamy lattes, and warming treats — perfect for a cosy evening in our parlour.",
    image: "/images/hot-chocolate.jpg",
    color: "#F38DB5",
    emoji: "☕",
    doodle: "🌹"
  },
  {
    name: "Protein Whippy Available 💪",
    description: "Still want something sweet but keeping it balanced? Our protein whippy is guilt-free and delicious.",
    image: "/images/protein-whippy.jpg",
    color: "#D4526E",
    emoji: "💪",
    doodle: "✨"
  }
];

export function MenuHighlightsSection() {
  return (
    <section className="py-20 bg-[#FFFBF8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 800, color: '#1F1B24' }}>
              🍨 Menu Highlights
            </h2>
            <p className="text-xl" style={{ color: '#717182' }}>
              Your ticket includes any dessert and any drink — choose on the night.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.map((item, index) => (
              <Card key={index} className="overflow-hidden border-2 border-transparent hover:border-[#D4526E] transition-all hover:shadow-2xl group relative">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {/* Floating icon */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: item.color }}>
                    <Sparkles className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                  </div>

                  {/* Valentine's doodle in corner */}
                  <div className="absolute bottom-4 left-4 text-2xl opacity-70">
                    {item.doodle}
                  </div>
                </div>

                <div className="p-4 bg-white space-y-2">
                  <h3 className="text-base" style={{ fontWeight: 700, color: '#1F1B24' }}>
                    {item.name}
                  </h3>
                  <p className="text-sm" style={{ color: '#717182' }}>
                    {item.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Additional note */}
          <div className="mt-12 text-center p-6 rounded-2xl bg-gradient-to-r from-[#FFE8F0] to-[#FFF5F0]">
            <p className="text-lg" style={{ color: '#1F1B24' }}>
              Plus all your favourite flavours from our regular menu! 🍦💘
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
