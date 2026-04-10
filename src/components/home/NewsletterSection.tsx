import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Merci pour votre inscription !");
    setEmail("");
  };

  return (
    <section className="py-20 bg-secondary">
      <div className="container px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
          Newsletter Festicup<sup>®</sup>
        </h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Recevez tous les mois nos actus, conseils éco-responsables et offres exclusives.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-background border-border text-foreground placeholder:text-muted-foreground flex-1"
          />
          <Button type="submit" className="px-8 whitespace-nowrap">
            S'abonner
          </Button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
