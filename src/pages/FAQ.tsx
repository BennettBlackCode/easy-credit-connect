import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What is 1clickseo.io?",
      answer: "1clickseo.io is an automated SEO platform that helps marketing agencies deliver comprehensive SEO campaigns quickly and efficiently. Our platform provides blog posts, Google Business Profile posts, backlink analysis, and keyword research in one click."
    },
    {
      question: "How does the credit system work?",
      answer: "Credits are consumed per automation run. Each run provides you with a complete SEO package including blog posts, GBP posts, backlink analysis, and keyword research. The number of credits you receive depends on your subscription plan."
    },
    {
      question: "What's included in each automation run?",
      answer: "Each automation run includes: 48 SEO-optimized blog posts, 360 Google Business Profile posts in CSV format, analysis of 1000+ top backlinks from local competitors, and comprehensive keyword research with CPC, KD, and search volume data."
    },
    {
      question: "Can I customize the output?",
      answer: "Yes, you can customize various aspects of the automation output, including target keywords, competitor analysis parameters, and content preferences. This ensures the generated content aligns with your specific business needs."
    },
    {
      question: "How often can I run automations?",
      answer: "The number of automation runs depends on your subscription plan. The Starter Pack includes 3 runs per month, while the Growth Pack provides 15 runs. Enterprise plans offer unlimited runs."
    },
    {
      question: "How often can I repurchase credits?",
      answer: "You can repurchase credits for your current plan once per month. However, you have the flexibility to upgrade to a higher tier plan at any time to access more credits and features."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we offer a free trial that allows you to experience our platform's capabilities. You can sign up and try the service without any commitment to see how it can benefit your business."
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#030303]">
      <div className="relative pt-36 lg:pt-44 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-30" />
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center space-y-8 mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Find answers to common questions about our SEO automation platform
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 sm:p-8">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-white/10 last:border-0">
                  <AccordionTrigger className="text-left text-lg font-medium text-white hover:text-primary transition-colors py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
