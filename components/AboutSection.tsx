import { Heart, Film, Coffee } from "lucide-react";

export function AboutSection() {
  return (
    <section id="movies" className="py-20 bg-[#FFFBF8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 800, color: '#1F1B24' }}>
            💖 Valentine's Movie Schedule
          </h2>

          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#717182', lineHeight: '1.8' }}>
            Three nights of romance, laughter, and emotion. Each ticket includes your choice of any dessert and any drink — the perfect date-night experience.
          </p>

          {/* Movie Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#F8AFC8' }}>
                <Heart className="w-8 h-8" style={{ color: '#D4526E' }} />
              </div>
              <h3 style={{ fontWeight: 700, color: '#1F1B24' }}>Night 1 — Friday 13th Feb</h3>
              <p className="text-2xl">🎬</p>
              <p style={{ fontWeight: 600, color: '#D4526E' }}>Crazy, Stupid, Love</p>
              <p className="text-sm" style={{ color: '#717182' }}>Smart comedy, sharp humour, and modern romance.</p>
            </div>

            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#D4526E' }}>
                <Film className="w-8 h-8" style={{ color: '#FFFFFF' }} />
              </div>
              <h3 style={{ fontWeight: 700, color: '#1F1B24' }}>Night 2 — Saturday 14th Feb</h3>
              <p className="text-2xl">🎬</p>
              <p style={{ fontWeight: 600, color: '#D4526E' }}>The Proposal</p>
              <p className="text-sm" style={{ color: '#717182' }}>Light-hearted, funny, and perfect for a relaxed date night.</p>
            </div>

            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white shadow-md hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#F38DB5' }}>
                <Coffee className="w-8 h-8" style={{ color: '#FFFFFF' }} />
              </div>
              <h3 style={{ fontWeight: 700, color: '#1F1B24' }}>Night 3 — Sunday 15th Feb</h3>
              <p className="text-2xl">🎬</p>
              <p style={{ fontWeight: 600, color: '#D4526E' }}>A Star Is Born</p>
              <p className="text-sm" style={{ color: '#717182' }}>Emotional, powerful, and a romantic finale.</p>
            </div>
          </div>

          {/* Note */}
          <div className="mt-8 p-4 rounded-xl" style={{ background: '#FFE8F0' }}>
            <p style={{ color: '#1F1B24', fontWeight: 600 }}>
              Adults only • Limited seats available • Booking essential
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
