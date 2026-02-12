import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

const faqs = [
  {
    question: "Are kids welcome?",
    answer: "Yes — these cinema nights are designed especially for children and families."
  },
  {
    question: "What time should we arrive?",
    answer: "Please arrive 10–15 minutes before 4:30pm so everyone is settled before the film starts."
  },
  {
    question: "Can parents stay with their children?",
    answer: "Absolutely — parents and carers are welcome to stay and enjoy the screening. Kids aged 13+ can be left alone if they're happy to watch by themselves."
  },
  {
    question: "What's included in the ticket?",
    answer: "Each ticket includes a dessert and a drink, chosen on the day."
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
