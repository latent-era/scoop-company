import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

const faqs = [
  {
    question: "Is this event adults only?",
    answer: "Yes — Valentine's Movie Nights are strictly 18+. This is designed as a relaxed, grown-up evening."
  },
  {
    question: "Can children or babies attend?",
    answer: "No. This event is designed as a relaxed, adults-only evening. We appreciate your understanding."
  },
  {
    question: "What's included in the ticket?",
    answer: "Every £12 ticket includes entry to the movie, any dessert from our menu, and any drink. Choose on the night."
  },
  {
    question: "Do we need to sit together?",
    answer: "We'll do our best to seat bookings together, but seating is first come, first served within the layout."
  },
  {
    question: "When should we arrive?",
    answer: "Please arrive 15 minutes before the movie starts. Films begin promptly so you don't miss a moment."
  },
  {
    question: "Do I need to pay on arrival?",
    answer: "No — payment is taken at the time of booking and secures your seat. Nothing to pay on the night."
  },
  {
    question: "Can I change or cancel my booking?",
    answer: "If you need to make changes, please contact us at least 24 hours in advance and we'll do our best to help."
  },
  {
    question: "Is there parking nearby?",
    answer: "Yes! Free parking is available nearby. We're easy to find at 369 Limpsfield Road, Warlingham."
  }
];

export function FAQSection() {
  return (
    <section className="py-20 bg-[#FFFBF8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 800, color: '#1F1B24' }}>
              💬 Frequently Asked Questions
            </h2>
            <p className="text-xl mt-4" style={{ color: '#717182' }}>
              Everything you need to know 💘
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white border-2 border-transparent hover:border-[#F8AFC8] rounded-xl px-6 shadow-sm hover:shadow-md transition-all"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span style={{ fontWeight: 600, color: '#1F1B24' }}>{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-6" style={{ color: '#717182' }}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Still have questions */}
          <div className="mt-12 text-center p-8 rounded-2xl" style={{ background: 'linear-gradient(135deg, #FFE8F0 0%, #FFF5F0 100%)' }}>
            <p className="text-lg" style={{ color: '#1F1B24' }}>
              Still have questions? <a href="https://www.instagram.com/thescoopcompany_/" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ fontWeight: 600, color: '#D4526E' }}>DM us on Instagram!</a> 📱
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
