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
    answer:
      "Oui, bien sûr ! Notre formulaire de devis vous permet de configurer votre commande sur mesure. Vous recevrez une offre personnalisée sous 24h ouvrées.",
  },
  {
    question: "Sous quel délai vais-je recevoir une réponse ?",
    answer:
      "Nous traitons toutes les demandes sous 24h ouvrées. Pour les demandes urgentes, n'hésitez pas à nous contacter directement par téléphone.",
  },
  {
    question: "Que prend en charge Festicup lors de l'événement ?",
    answer:
      "Festicup peut prendre en charge la livraison, le lavage, la mise en place d'un système de consigne et le support logistique sur site selon vos besoins.",
  },
  {
    question: "Je ne souhaite pas acheter de verres, puis-je les louer ?",
    answer:
      "Absolument ! Nous proposons un service de location de gobelets réutilisables. C'est la solution idéale pour les événements ponctuels. La caution n'est jamais débitée.",
  },
  {
    question: "Pour quels types d'événements puis-je faire appel à Festicup ?",
    answer:
      "Festicup accompagne tout type d'événement : festivals, concerts, mariages, séminaires d'entreprise, événements sportifs, fêtes privées et bien plus encore.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-center mb-6">
          Questions et réponses
        </h2>

        <div className="flex justify-center mb-10">
          <Link to="/faq">
            <Button variant="outline" className="rounded-full px-6 text-sm">
              Voir toutes les questions
            </Button>
          </Link>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg mb-3 px-4">
              <AccordionTrigger className="text-sm font-medium text-left hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-5">
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
