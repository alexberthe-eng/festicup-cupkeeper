import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useI18n, type Locale } from "@/contexts/I18nContext";

const faqs: { question: Record<Locale, string>; answer: Record<Locale, string> }[] = [
  {
    question: { fr: "Puis-je demander un devis personnalisé via ce formulaire ?", nl: "Kan ik een gepersonaliseerde offerte aanvragen via dit formulier?", en: "Can I request a personalized quote through this form?" },
    answer: { fr: "Oui, bien sûr ! Notre formulaire de devis vous permet de configurer votre commande sur mesure. Vous recevrez une offre personnalisée sous 24h ouvrées.", nl: "Ja, natuurlijk! Ons offerteformulier stelt u in staat uw bestelling op maat te configureren. U ontvangt een gepersonaliseerd aanbod binnen 24 werkuren.", en: "Yes, of course! Our quote form allows you to configure your custom order. You'll receive a personalized offer within 24 business hours." },
  },
  {
    question: { fr: "Sous quel délai vais-je recevoir une réponse ?", nl: "Binnen welke termijn ontvang ik een antwoord?", en: "How quickly will I receive a response?" },
    answer: { fr: "Nous traitons toutes les demandes sous 24h ouvrées. Pour les demandes urgentes, n'hésitez pas à nous contacter directement par téléphone.", nl: "Wij verwerken alle aanvragen binnen 24 werkuren. Voor dringende aanvragen kunt u ons direct telefonisch contacteren.", en: "We process all requests within 24 business hours. For urgent requests, feel free to contact us directly by phone." },
  },
  {
    question: { fr: "Que prend en charge Festicup lors de l'événement ?", nl: "Wat doet Festicup tijdens het evenement?", en: "What does Festicup handle during the event?" },
    answer: { fr: "Festicup peut prendre en charge la livraison, le lavage, la mise en place d'un système de consigne et le support logistique sur site selon vos besoins.", nl: "Festicup kan de levering, het wassen, het opzetten van een statiegeldsysteem en logistieke ondersteuning ter plaatse verzorgen, afhankelijk van uw behoeften.", en: "Festicup can handle delivery, washing, setting up a deposit system and on-site logistical support according to your needs." },
  },
  {
    question: { fr: "Je ne souhaite pas acheter de verres, puis-je les louer ?", nl: "Ik wil geen glazen kopen, kan ik ze huren?", en: "I don't want to buy glasses, can I rent them?" },
    answer: { fr: "Absolument ! Nous proposons un service de location de gobelets réutilisables. C'est la solution idéale pour les événements ponctuels. La caution n'est jamais débitée.", nl: "Absoluut! Wij bieden een verhuurservice voor herbruikbare bekers. Dit is de ideale oplossing voor eenmalige evenementen. De borg wordt nooit afgeschreven.", en: "Absolutely! We offer a reusable cup rental service. It's the ideal solution for one-time events. The deposit is never charged." },
  },
  {
    question: { fr: "Pour quels types d'événements puis-je faire appel à Festicup ?", nl: "Voor welke soorten evenementen kan ik een beroep doen op Festicup?", en: "What types of events can I use Festicup for?" },
    answer: { fr: "Festicup accompagne tout type d'événement : festivals, concerts, mariages, séminaires d'entreprise, événements sportifs, fêtes privées et bien plus encore.", nl: "Festicup begeleidt elk type evenement: festivals, concerten, bruiloften, bedrijfsseminars, sportevenementen, privéfeesten en nog veel meer.", en: "Festicup supports all types of events: festivals, concerts, weddings, corporate seminars, sports events, private parties and much more." },
  },
];

const FAQSection = () => {
  const { t, locale } = useI18n();

  return (
    <section className="py-14 lg:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
        <h2 className="text-2xl lg:text-4xl font-serif font-bold text-center mb-4">{t("faq.title")}</h2>
        <div className="flex justify-center mb-8">
          <Link to="/faq">
            <Button variant="outline" className="rounded-full px-5 h-9 text-xs border-border">{t("faq.allQuestions")}</Button>
          </Link>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-2.5">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4 bg-secondary/30">
              <AccordionTrigger className="text-xs font-medium text-left hover:no-underline py-4">{faq.question[locale]}</AccordionTrigger>
              <AccordionContent className="text-xs text-muted-foreground pb-4">{faq.answer[locale]}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
