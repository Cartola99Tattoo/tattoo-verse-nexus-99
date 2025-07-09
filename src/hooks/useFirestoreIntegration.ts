
import { useState, useEffect, useCallback } from 'react';
import { firestoreService, SPINAnswers, MonthlyMetrics, TattooArtistData } from '@/services/FirestoreService';
import { toast } from '@/hooks/use-toast';

export const useFirestoreIntegration = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [spinAnswers, setSPINAnswers] = useState<SPINAnswers>({});
  const [monthlyMetrics, setMonthlyMetrics] = useState<Record<string, MonthlyMetrics>>({});

  // Inicializar autenticação e carregar dados
  useEffect(() => {
    const initializeFirestore = async () => {
      try {
        setLoading(true);
        
        // Aguardar autenticação
        await firestoreService.populateMockData();
        setIsAuthenticated(true);
        
        // Carregar dados do usuário atual
        await loadUserData();
        
      } catch (error) {
        console.error('Erro na inicialização do Firestore:', error);
        toast({
          title: "Erro de Conexão",
          description: "Não foi possível conectar ao banco de dados. Usando dados locais.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    initializeFirestore();
  }, []);

  // Carregar dados do usuário
  const loadUserData = useCallback(async () => {
    try {
      const [spinData, metricsData] = await Promise.all([
        firestoreService.getSPINAnswers(),
        firestoreService.getMonthlyMetrics()
      ]);

      if (spinData) {
        setSPINAnswers(spinData);
      }

      if (metricsData) {
        setMonthlyMetrics(metricsData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  }, []);

  // Salvar respostas SPIN
  const saveSPINSection = useCallback(async (section: string, answers: Record<string, string>) => {
    try {
      await firestoreService.saveSPINAnswers(section, answers);
      
      // Atualizar estado local
      setSPINAnswers(prev => ({
        ...prev,
        [section]: answers
      }));

      toast({
        title: "Seção salva com sucesso!",
        description: `As respostas da seção foram salvas no seu perfil.`,
      });

      return true;
    } catch (error) {
      console.error('Erro ao salvar seção SPIN:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as respostas. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  }, []);

  // Salvar métricas mensais
  const saveMonthlyMetrics = useCallback(async (
    monthYear: string, 
    metrics: Omit<MonthlyMetrics, 'dataRegistro'>
  ) => {
    try {
      await firestoreService.saveMonthlyMetrics(monthYear, metrics);
      
      // Recarregar métricas
      const updatedMetrics = await firestoreService.getMonthlyMetrics();
      setMonthlyMetrics(updatedMetrics);

      toast({
        title: "Métricas salvas!",
        description: `Os dados de ${monthYear} foram registrados com sucesso.`,
      });

      return true;
    } catch (error) {
      console.error('Erro ao salvar métricas:', error);
      toast({
        title: "Erro ao salvar métricas",
        description: "Não foi possível salvar os dados. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  }, []);

  return {
    isAuthenticated,
    loading,
    spinAnswers,
    monthlyMetrics,
    saveSPINSection,
    saveMonthlyMetrics,
    loadUserData
  };
};

// Hook específico para o CRM
export const useCRMData = () => {
  const [artists, setArtists] = useState<TattooArtistData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCRMData = async () => {
      try {
        setLoading(true);
        
        // Popular dados mock se necessário
        await firestoreService.populateMockData();
        
        // Configurar listener em tempo real
        const unsubscribe = firestoreService.onArtistsChange((updatedArtists) => {
          setArtists(updatedArtists);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Erro ao carregar dados do CRM:', error);
        setLoading(false);
      }
    };

    let unsubscribe: (() => void) | undefined;
    
    loadCRMData().then((unsub) => {
      if (unsub) unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { artists, loading };
};
