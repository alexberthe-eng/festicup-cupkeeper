import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Puis-je demander un devis personnalisé via ce formulaire ?",
    answer: "Oui, bien sûr ! Notre formulaire de devis vous permet de configurer votre commande sur mesure. Vous recevrez une offre personnalisée sous 24h ouvrées.",
  },
  {
    question: "Sous quel délai vais-je recevoir une réponse ?",
    answer: "Nous traitons toutes les demandes sous 24h ouvrées. Pour les demandes urgentes, n'hésitez pas à nous contacter directement par téléphone.",
  },
  {
    question: "Que prend en charge Festicup lors de l'événement ?",
    answer: "Festicup peut prendre en charge la livraison, le lavage, la mise en place d'un système de consigne et le support logistique sur site selon vos besoins.",
  },
  {
    question: "Je ne souhaite pas acheter de verres, puis-je les louer ?",
    answer: "Absolument ! Nous proposons un service de location de gobelets réutilisables. C'est la solution idéale pour les événements ponctuels. La caution n'est jamais débitée.",
  },
  {
    question: "Pour quels types d'événements puis-je faire appel à Festicup ?",
    answer: "Festicup accompagne tout type d'événement : festivals, concerts, mariages, séminaires d'entreprise, événements sportifs, fêtes privées et bien plus encore.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-14 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
        <h2 className="text-2xl lg:text-4xl font-serif font-bold text-center mb-4">
          Questions et réponses
        </h2>

        <div className="flex justify-center mb-8">
          <Link to="/faq">
            <Button variant="outline" className="rounded-full px-5 h-9 text-xs border-border">
              Voir toutes les questions
            </Button>
          </Link>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-2.5">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4 bg-secondary/30">
              <AccordionTrigger className="text-xs font-medium text-left hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
