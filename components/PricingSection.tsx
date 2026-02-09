'use client';

import { Card } from "./ui/card";
import { Check } from "lucide-react";
import { TICKETS_SOLD_OUT } from "@/lib/inventory";

export function PricingSection() {
  const scrollToTickets = () => {
    document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20" style={{ background: 'linear-gradient(135deg, #FFE8F0 0%, #FFF5F0 100%)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 800, color: '#1F1B24' }}>
              💕 How It Works
            </h2>
            <p className="text-xl" style={{ color: '#717182' }}>
              Simple booking, sweet experience
            </p>
          </div>

          {/* Single Pricing Card */}
          <div className="flex justify-center mb-12">
            <Card
              className={`relative p-8 bg-white border-2 transition-all max-w-md w-full ${
                TICKETS_SOLD_OUT ? 'opacity-75 cursor-default' : 'hover:shadow-2xl cursor-pointer'
              } border-[#D4526E] shadow-xl`}
              onClick={TICKETS_SOLD_OUT ? undefined : scrollToTickets}
            >
              {TICKETS_SOLD_OUT && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm z-20" style={{ background: '#1F1B24', color: 'white', fontWeight: 700 }}>
                  SOLD OUT
                </div>
              )}
              {!TICKETS_SOLD_OUT && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm" style={{ background: '#D4526E', color: 'white', fontWeight: 600 }}>
                  🔞 Adults Only (18+)
                </div>
              )}

              <div className="text-center space-y-4">
                <div className="text-4xl">🎟️</div>

                <h3 className="text-xl" style={{ fontWeight: 700, color: '#1F1B24' }}>
                  Adult Ticket
                </h3>

                <div className="py-4">
                  <div className="text-5xl" style={{ fontWeight: 800, color: '#D4526E' }}>
                    £12
                  </div>
                  <p className="mt-2" style={{ color: '#717182' }}>
                    per person
                  </p>
                </div>

                <div className="p-3 rounded-lg" style={{ background: '#D4526E15' }}>
                  <p style={{ fontWeight: 600, color: '#1F1B24' }}>
                    Any dessert + any drink
                  </p>
                </div>

                <div className="pt-4 space-y-3 text-left">
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#D4526E' }} />
                    <span style={{ color: '#717182' }}>Full dessert menu access</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#D4526E' }} />
                    <span style={{ color: '#717182' }}>All drinks included</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#D4526E' }} />
                    <span style={{ color: '#717182' }}>Romantic movie screening</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#D4526E' }} />
                    <span style={{ color: '#717182' }}>Perfect date night experience</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Event Details */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card className="p-6 bg-white/80 backdrop-blur-sm text-center">
              <div className="text-3xl mb-2">🗓</div>
              <h4 style={{ fontWeight: 700, color: '#1F1B24' }}>When</h4>
              <p style={{ color: '#717182' }}>Valentine's Weekend</p>
              <p className="text-sm" style={{ color: '#717182' }}>Fri 13th – Sun 15th Feb</p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm text-center">
              <div className="text-3xl mb-2">📍</div>
              <h4 style={{ fontWeight: 700, color: '#1F1B24' }}>Where</h4>
              <p style={{ color: '#717182' }}>The Scoop Company, Warlingham</p>
              <p className="text-sm" style={{ color: '#717182' }}>Free parking nearby</p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm text-center">
              <div className="text-3xl mb-2">🕖</div>
              <h4 style={{ fontWeight: 700, color: '#1F1B24' }}>Time</h4>
              <p style={{ color: '#717182' }}>Evening screenings</p>
              <p className="text-sm" style={{ color: '#717182' }}>Please arrive 15 mins early</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
