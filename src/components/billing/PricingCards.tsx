
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price_amount: number;
  credits_amount: number;
}

interface PricingCardsProps {
  products: Product[];
  onPurchase: (productId: string) => void;
  currentPlan?: string;
}

export const PricingCards = ({ products, onPurchase, currentPlan = "Free Tier" }: PricingCardsProps) => {
  const getButtonText = (productName: string) => {
    if (currentPlan === productName) {
      return "Refill";
    }
    if (currentPlan === "Starter Pack" && productName === "Growth Pack") {
      return "Upgrade";
    }
    return "Purchase";
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
      {products && products.map((product) => (
        <Card key={product.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1">
            <p className="text-sm text-muted-foreground mb-4">
              {product.description}
            </p>
            <div className="flex flex-col gap-2 mb-4">
              <div className="text-2xl font-bold">
                ${(product.price_amount / 100).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                Includes {product.credits_amount} credits
              </div>
            </div>
            <div className="mt-auto">
              <Button 
                className="w-full"
                onClick={() => onPurchase(product.id)}
              >
                {getButtonText(product.name)}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Unlimited</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-1">
          <p className="text-sm text-muted-foreground mb-4">
            Unlimited runs, dedicated support, and custom integrations for enterprise needs
          </p>
          <div className="text-2xl font-bold mb-4">
            Contact Us
          </div>
          <div className="mt-auto">
            <Button asChild className="w-full">
              <a
                href="https://boldslate.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                Contact Us
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
