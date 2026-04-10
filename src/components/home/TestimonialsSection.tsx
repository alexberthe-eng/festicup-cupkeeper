import { Star } from "lucide-react";
import { mockTestimonials } from "@/data/mock";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-center text-foreground mb-4">
          Ils nous font confiance
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          Découvrez les témoignages de nos clients satisfaits.
        </p>
        <Carousel opts={{ align: "start", loop: true }} className="max-w-5xl mx-auto">
          <CarouselContent>
            {mockTestimonials.map((t) => (
              <CarouselItem key={t.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <div className="bg-secondary border border-border rounded-xl p-6 h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < t.rating ? "text-primary fill-primary" : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground flex-1 mb-4 italic leading-relaxed">
                    "{t.text}"
                  </p>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex -left-4 border-border text-foreground" />
          <CarouselNext className="hidden sm:flex -right-4 border-border text-foreground" />
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
