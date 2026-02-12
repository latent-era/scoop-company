import { Card } from "./ui/card";
import { Sparkles } from "lucide-react";

const menuItems = [
  {
    name: "🍦 Scoops & Whippy",
    description: "Choose your favourite flavours — from classic vanilla to adventurous treats!",
    image: "/images/rudolph-cone.jpg",
    color: "#F8AFC8",
    doodle: "⭐"
  },
  {
    name: "🍬 Toppings Galore",
    description: "Sprinkles, sauces, and fun extras to make your dessert even more special.",
    image: "/images/gingerbread-whippy.jpg",
    color: "#F38DB5",
    doodle: "✨"
  },
  {
    name: "☕ Hot Drinks for Grown-Ups",
    description: "Delicious hot drinks for parents and carers — because everyone deserves a treat!",
    image: "/images/hot-chocolate.jpg",
    color: "#E8A87C",
    doodle: "🌟"
  },
  {
    name: "🎨 Build Your Own Treat",
    description: "Mix and match flavours, toppings, and extras. Make it exactly how you like it!",
    image: "/images/christmas-cone.jpg",
    color: "#D4AF37",
    doodle: "🎈"
  }
];

export function MenuHighlightsSection() {
  return (
    <section className="py-20 bg-[#FFFBF8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 800, color: '#1F1B24' }}>
              🍨 Sweet Treats Included
            </h2>
            <p className="text-xl" style={{ color: '#717182' }}>
              Your ticket includes any dessert and any drink — choose on the day.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.map((item, index) => (
              <Card key={index} className="overflow-hidden border-2 border-transparent hover:border-[#F8AFC8] transition-all hover:shadow-2xl group relative">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  {/* Floating icon */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: item.color }}>
                    <Sparkles className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                  </div>

                  {/* Content overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white space-y-2">
                    <div className="text-3xl mb-2">{item.doodle}</div>
                    <h3 className="text-lg" style={{ fontWeight: 700 }}>
                      {item.name}
                    </h3>
                    <p className="text-sm text-white/90 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Additional note */}
          <div className="mt-12 text-center p-6 rounded-2xl bg-gradient-to-r from-[#FFE8F0] to-[#FFF5F0]">
            <p className="text-lg" style={{ color: '#1F1B24' }}>
              Plus all your favourite flavours from our regular menu! 🍦
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
