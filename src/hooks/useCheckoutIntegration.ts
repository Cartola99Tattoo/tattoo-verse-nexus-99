
import { useMutation } from "@tanstack/react-query";
import { getFinancialService } from "@/services/serviceFactory";
import { TattooTransaction } from "@/services/interfaces/IFinancialService";
import { toast } from "@/hooks/use-toast";

interface CheckoutData {
  orderId: string;
  productId: string;
  artistId: string;
  customerId: string;
  amount: number;
  customerName: string;
}

export const useCheckoutIntegration = () => {
  const financialService = getFinancialService();

  // Criar transação após checkout bem-sucedido
  const createTransactionMutation = useMutation({
    mutationFn: async (checkoutData: CheckoutData) => {
      const transactionData: Omit<TattooTransaction, 'id' | 'created_at' | 'updated_at'> = {
        order_id: checkoutData.orderId,
        product_id: checkoutData.productId,
        artist_id: checkoutData.artistId,
        customer_name: checkoutData.customerName,
        amount: checkoutData.amount,
        final_amount: checkoutData.amount,
        payment_status: 'pending',
        transaction_date: new Date().toISOString(),
        material_cost: 0, // Pode ser atualizado posteriormente
      };

      return financialService.createTattooTransaction(transactionData);
    },
    onSuccess: (transaction) => {
      console.log('Transação criada com sucesso:', transaction);
      toast({
        title: "Transação registrada",
        description: "A transação foi registrada no sistema financeiro.",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar transação:', error);
      toast({
        title: "Erro no registro financeiro",
        description: "Não foi possível registrar a transação.",
        variant: "destructive"
      });
    },
  });

  // Confirmar pagamento
  const confirmPaymentMutation = useMutation({
    mutationFn: async (transactionId: string) => {
      return financialService.updateTattooTransaction(transactionId, {
        payment_status: 'completed',
        completion_date: new Date().toISOString()
      });
    },
    onSuccess: () => {
      toast({
        title: "Pagamento confirmado",
        description: "O pagamento foi confirmado e a comissão foi calculada.",
      });
    },
  });

  return {
    createTransaction: createTransactionMutation.mutate,
    confirmPayment: confirmPaymentMutation.mutate,
    isCreatingTransaction: createTransactionMutation.isPending,
    isConfirmingPayment: confirmPaymentMutation.isPending,
  };
};
