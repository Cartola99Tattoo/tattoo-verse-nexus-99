
import React from "react";
import { Button } from "@/components/ui/button";

interface CheckoutFormProps {
  shippingForm: any;
  billingForm: any;
  isBillingSame: boolean;
  createCheckout: () => Promise<void>;
  isCreatingCheckout: boolean;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  createCheckout,
  isCreatingCheckout
}) => {
  return (
    <div className="space-y-6">
      <div className="border p-4 rounded-md">
        <p className="text-center text-gray-500">
          Este é um formulário simplificado de pagamento. 
          Em um ambiente de produção, você conectaria um processador de pagamentos como o Stripe aqui.
        </p>
      </div>
      
      <Button
        onClick={createCheckout}
        disabled={isCreatingCheckout}
        className="w-full"
      >
        {isCreatingCheckout ? "Processando..." : "Finalizar Compra"}
      </Button>
    </div>
  );
};

export default CheckoutForm;
