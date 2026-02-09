'use client';

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { TICKETS_SOLD_OUT, BOOKING_COMING_SOON } from "@/lib/inventory";

export function HeroSection() {
  const scrollToTickets = () => {
    document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToMovies = () => {
    document.getElementById('movies')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF5F0] via-[#FFE8F0] to-[#FFD5E5]">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#D4526E] blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-[#F8AFC8] blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-[#F38DB5] blur-2xl"></div>
      </div>

      {/* Floating decorative icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-24 left-[10%] text-4xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>💕</div>
        <div className="absolute top-32 right-[15%] text-3xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>🍦</div>
        <div className="absolute bottom-32 left-[20%] text-3xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}>💖</div>
        <div className="absolute top-1/3 right-[8%] text-2xl animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4s' }}>🌹</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center md:text-left space-y-6 relative z-20 order-1">
            <div className="flex flex-col sm:flex-row items-center md:items-start gap-3">
              <Badge className="px-4 py-2 text-sm" style={{ background: '#D4526E', color: 'white', fontWeight: 600 }}>
                🔞 18+ Event
              </Badge>
              <Badge className="px-4 py-2 text-sm border-2" style={{ background: 'transparent', borderColor: '#D4526E', color: '#D4526E', fontWeight: 600 }}>
                {BOOKING_COMING_SOON ? '💘 Coming Soon' : TICKETS_SOLD_OUT ? '💘 Sold Out' : '💘 Only 3 Valentine\'s Nights'}
              </Badge>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl" style={{ fontWeight: 800, lineHeight: '1.1', color: '#1F1B24' }}>
              💘 Valentine's Movie Nights
            </h1>

            <p className="text-xl md:text-2xl max-w-xl" style={{ color: '#1F1B24', lineHeight: '1.6' }}>
              Three nights of romantic films, sweet desserts, and cosy late-night vibes.<br/>
              <span style={{ fontWeight: 700, color: '#D4526E' }}>£12 per person</span> — includes any dessert + any drink.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={(TICKETS_SOLD_OUT || BOOKING_COMING_SOON) ? undefined : scrollToTickets}
                disabled={TICKETS_SOLD_OUT || BOOKING_COMING_SOON}
                className="w-full sm:w-auto text-base px-6 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: '#D4526E', color: 'white', fontWeight: 600 }}
              >
                🎟️ Book Your Tickets
              </Button>

              <Button
                onClick={scrollToMovies}
                className="w-full sm:w-auto text-base px-6 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2"
                style={{ background: 'white', borderColor: '#F8AFC8', color: '#1F1B24', fontWeight: 600 }}
              >
                🍦 See the Movie Line-Up
              </Button>
            </div>
          </div>

          {/* Right content - Image */}
          <div className="relative z-10 order-2 md:order-none">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <img
                src="/images/header-image.jpg"
                alt="Pink gelato cone"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            {/* Decorative elements around image */}
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-[#D4526E] opacity-80 blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-[#F38DB5] opacity-80 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
