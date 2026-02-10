import { Film, Sparkles } from "lucide-react";

export function AboutSection() {
  return (
    <section id="movies" className="py-20 bg-[#FFFBF8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 800, color: '#1F1B24' }}>
            🎬 Movie Schedule
          </h2>

          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#717182', lineHeight: '1.8' }}>
            Two magical movie nights for the whole family. Each ticket includes your choice of any dessert and any drink.
          </p>

          {/* Movie Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#F8AFC8' }}>
                <Film className="w-8 h-8" style={{ color: '#D4526E' }} />
              </div>
              <h3 style={{ fontWeight: 700, color: '#1F1B24' }}>Thursday 19th Feb</h3>
              <p className="text-2xl">🌹</p>
              <p style={{ fontWeight: 600, color: '#D4526E' }}>Gnomeo & Juliet</p>
              <p className="text-sm" style={{ color: '#717182' }}>A gnome-tastic animated adventure for all ages.</p>
            </div>

            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#D4526E' }}>
                <Sparkles className="w-8 h-8" style={{ color: '#FFFFFF' }} />
              </div>
              <h3 style={{ fontWeight: 700, color: '#1F1B24' }}>Friday 20th Feb</h3>
              <p className="text-2xl">✨</p>
              <p style={{ fontWeight: 600, color: '#D4526E' }}>Tangled</p>
              <p className="text-sm" style={{ color: '#717182' }}>A magical Disney classic full of adventure and heart.</p>
            </div>
          </div>

          {/* Note */}
          <div className="mt-8 p-4 rounded-xl" style={{ background: '#FFE8F0' }}>
            <p style={{ color: '#1F1B24', fontWeight: 600 }}>
              Family-friendly • Limited seats available • Booking essential
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
