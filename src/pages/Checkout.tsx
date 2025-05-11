import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCart } from "@/hooks/useCart";
import { useCartTotals } from "@/hooks/useCartTotals";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { api } from "@/integrations/axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/Checkout/CheckoutForm";
import Layout from "@/components/layout/Layout";

const shippingAddressSchema = z.object({
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  zip_code: z.string().min(5, {
    message: "Zip code must be at least 5 characters.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone must be at least 10 characters.",
  }),
});

export type ShippingAddressValues = z.infer<typeof shippingAddressSchema>;

const billingAddressSchema = z.object({
  billing_first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  billing_last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  billing_address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  billing_city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  billing_state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  billing_zip_code: z.string().min(5, {
    message: "Zip code must be at least 5 characters.",
  }),
  billing_country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
  billing_phone: z.string().min(10, {
    message: "Phone must be at least 10 characters.",
  }),
});

export type BillingAddressValues = z.infer<typeof billingAddressSchema>;

export default function Checkout() {
  const { session, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { cartTotalPrice } = useCartTotals();
  const [stripeUrl, setStripeUrl] = useState<string | null>(null);

  const shippingForm = useForm<ShippingAddressValues>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      first_name: user?.user_metadata?.first_name || "",
      last_name: user?.user_metadata?.last_name || "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      country: "",
      phone: "",
    },
  });

  const billingForm = useForm<BillingAddressValues>({
    resolver: zodResolver(billingAddressSchema),
    defaultValues: {
      billing_first_name: user?.user_metadata?.first_name || "",
      billing_last_name: user?.user_metadata?.last_name || "",
      billing_address: "",
      billing_city: "",
      billing_state: "",
      billing_zip_code: "",
      billing_country: "",
      billing_phone: "",
    },
  });

  const [isBillingSame, setIsBillingSame] = useState(true);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  useEffect(() => {
    if (!session && !isLoading) {
      navigate("/auth");
    }
  }, [session, isLoading, navigate]);

  const createCheckout = async () => {
    setIsCreatingCheckout(true);
    try {
      const shippingData = shippingForm.getValues();
      const billingData = isBillingSame
        ? shippingData
        : billingForm.getValues();

      const response = await api.post("/checkout", {
        shipping_address: shippingData,
        billing_address: billingData,
        cart: cart,
      });

      setStripeUrl(response.data.url);
      clearCart();
    } catch (error: any) {
      toast({
        title: "Erro ao criar checkout",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  useEffect(() => {
    if (stripeUrl) {
      window.location.href = stripeUrl;
    }
  }, [stripeUrl]);

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
  );

  if (isLoading) {
    return <Layout>Carregando...</Layout>;
  }

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold text-center mb-6">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address Form */}
          <Card>
            <CardHeader>
              <CardTitle>Endereço de Entrega</CardTitle>
              <CardDescription>
                Insira seus dados de entrega para o pedido.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={shippingForm.handleSubmit((data) => console.log(data))} className="space-y-4">
                <div>
                  <Label htmlFor="first_name">Nome *</Label>
                  <Input
                    id="first_name"
                    type="text"
                    placeholder="Nome"
                    {...shippingForm.register("first_name")}
                  />
                  {shippingForm.formState.errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {shippingForm.formState.errors.first_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="last_name">Sobrenome *</Label>
                  <Input
                    id="last_name"
                    type="text"
                    placeholder="Sobrenome"
                    {...shippingForm.register("last_name")}
                  />
                  {shippingForm.formState.errors.last_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {shippingForm.formState.errors.last_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="address">Endereço *</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Endereço"
                    {...shippingForm.register("address")}
                  />
                  {shippingForm.formState.errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {shippingForm.formState.errors.address.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="Cidade"
                      {...shippingForm.register("city")}
                    />
                    {shippingForm.formState.errors.city && (
                      <p className="text-red-500 text-sm mt-1">
                        {shippingForm.formState.errors.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="state">Estado *</Label>
                    <Input
                      id="state"
                      type="text"
                      placeholder="Estado"
                      {...shippingForm.register("state")}
                    />
                    {shippingForm.formState.errors.state && (
                      <p className="text-red-500 text-sm mt-1">
                        {shippingForm.formState.errors.state.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zip_code">CEP *</Label>
                    <Input
                      id="zip_code"
                      type="text"
                      placeholder="CEP"
                      {...shippingForm.register("zip_code")}
                    />
                    {shippingForm.formState.errors.zip_code && (
                      <p className="text-red-500 text-sm mt-1">
                        {shippingForm.formState.errors.zip_code.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="country">País *</Label>
                    <Input
                      id="country"
                      type="text"
                      placeholder="País"
                      {...shippingForm.register("country")}
                    />
                    {shippingForm.formState.errors.country && (
                      <p className="text-red-500 text-sm mt-1">
                        {shippingForm.formState.errors.country.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    type="text"
                    placeholder="Telefone"
                    {...shippingForm.register("phone")}
                  />
                  {shippingForm.formState.errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {shippingForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Billing Address Form */}
          <Card>
            <CardHeader>
              <CardTitle>Endereço de Cobrança</CardTitle>
              <CardDescription>
                Insira os dados de cobrança para o pedido.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <label
                  htmlFor="isBillingSame"
                  className="inline-flex items-center space-x-2"
                >
                  <Input
                    type="checkbox"
                    id="isBillingSame"
                    defaultChecked={isBillingSame}
                    onChange={(e) => setIsBillingSame(e.target.checked)}
                    className="focus:ring-0"
                  />
                  <span>Usar o mesmo endereço de entrega</span>
                </label>

                {!isBillingSame && (
                  <form onSubmit={billingForm.handleSubmit((data) => console.log(data))} className="space-y-4">
                    <div>
                      <Label htmlFor="billing_first_name">Nome *</Label>
                      <Input
                        id="billing_first_name"
                        type="text"
                        placeholder="Nome"
                        {...billingForm.register("billing_first_name")}
                      />
                      {billingForm.formState.errors.billing_first_name && (
                        <p className="text-red-500 text-sm mt-1">
                          {billingForm.formState.errors.billing_first_name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="billing_last_name">Sobrenome *</Label>
                      <Input
                        id="billing_last_name"
                        type="text"
                        placeholder="Sobrenome"
                        {...billingForm.register("billing_last_name")}
                      />
                      {billingForm.formState.errors.billing_last_name && (
                        <p className="text-red-500 text-sm mt-1">
                          {billingForm.formState.errors.billing_last_name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="billing_address">Endereço *</Label>
                      <Input
                        id="billing_address"
                        type="text"
                        placeholder="Endereço"
                        {...billingForm.register("billing_address")}
                      />
                      {billingForm.formState.errors.billing_address && (
                        <p className="text-red-500 text-sm mt-1">
                          {billingForm.formState.errors.billing_address.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="billing_city">Cidade *</Label>
                        <Input
                          id="billing_city"
                          type="text"
                          placeholder="Cidade"
                          {...billingForm.register("billing_city")}
                        />
                        {billingForm.formState.errors.billing_city && (
                          <p className="text-red-500 text-sm mt-1">
                            {billingForm.formState.errors.billing_city.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="billing_state">Estado *</Label>
                        <Input
                          id="billing_state"
                          type="text"
                          placeholder="Estado"
                          {...billingForm.register("billing_state")}
                        />
                        {billingForm.formState.errors.billing_state && (
                          <p className="text-red-500 text-sm mt-1">
                            {billingForm.formState.errors.billing_state.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="billing_zip_code">CEP *</Label>
                        <Input
                          id="billing_zip_code"
                          type="text"
                          placeholder="CEP"
                          {...billingForm.register("billing_zip_code")}
                        />
                        {billingForm.formState.errors.billing_zip_code && (
                          <p className="text-red-500 text-sm mt-1">
                            {billingForm.formState.errors.billing_zip_code.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="billing_country">País *</Label>
                        <Input
                          id="billing_country"
                          type="text"
                          placeholder="País"
                          {...billingForm.register("billing_country")}
                        />
                        {billingForm.formState.errors.billing_country && (
                          <p className="text-red-500 text-sm mt-1">
                            {billingForm.formState.errors.billing_country.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="billing_phone">Telefone *</Label>
                      <Input
                        id="billing_phone"
                        type="text"
                        placeholder="Telefone"
                        {...billingForm.register("billing_phone")}
                      />
                      {billingForm.formState.errors.billing_phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {billingForm.formState.errors.billing_phone.message}
                        </p>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6" />

        <Card>
          <CardHeader>
            <CardTitle>Pagamento</CardTitle>
            <CardDescription>
              Insira os dados do cartão para realizar o pagamento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stripePromise ? (
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  shippingForm={shippingForm}
                  billingForm={billingForm}
                  isBillingSame={isBillingSame}
                  createCheckout={createCheckout}
                  isCreatingCheckout={isCreatingCheckout}
                />
              </Elements>
            ) : (
              <div>Stripe não está disponível.</div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div>
              Total:{" "}
              <span className="text-xl font-bold">
                R$ {cartTotalPrice.toFixed(2)}
              </span>
            </div>
            <Button
              disabled={isCreatingCheckout}
              onClick={createCheckout}
            >
              {isCreatingCheckout ? "Processando..." : "Finalizar Compra"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
