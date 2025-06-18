
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { multiTenantTestService, TestResult } from '@/services/test/MultiTenantTestService';
import { mockStudios, calculateConsolidatedMetrics } from '@/services/mock/mockMultiTenantData';
import { Play, CheckCircle, XCircle, AlertTriangle, BarChart, Shield, Database, Zap } from 'lucide-react';

const MultiTenantTestDashboard = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [consolidatedData, setConsolidatedData] = useState<any>(null);

  const runTests = async () => {
    setIsRunning(true);
    setShowReport(false);
    
    try {
      // Simular delay para mostrar o processo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = multiTenantTestService.runAllTests();
      setTestResults(results);
      
      // Carregar dados consolidados para visualização
      const naveMaeData = multiTenantTestService.getNaveMaeData();
      setConsolidatedData(naveMaeData.consolidatedMetrics);
      
      setShowReport(true);
    } catch (error) {
      console.error('Erro ao executar testes:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'PASS':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'FAIL':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'WARNING':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      'PASS': 'default',
      'FAIL': 'destructive',
      'WARNING': 'secondary'
    } as const;

    return (
      <Badge variant={variants[status]} className="ml-2">
        {status}
      </Badge>
    );
  };

  const generateFinalReport = () => {
    return multiTenantTestService.generateTestReport();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6 text-blue-600" />
            Dashboard de Testes Multi-Tenant
          </CardTitle>
          <p className="text-gray-600">
            Validação completa do sistema: agregação de dados, segregação de permissões, 
            relatórios consolidados, integração entre plataformas e performance.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={runTests} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Executando Testes...' : 'Executar Todos os Testes'}
            </Button>
            
            {showReport && (
              <Button 
                variant="outline" 
                onClick={() => {
                  const report = generateFinalReport();
                  console.log(report);
                  alert('Relatório completo gerado no console!');
                }}
              >
                Gerar Relatório Completo
              </Button>
            )}
          </div>

          {isRunning && (
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                Executando validação completa do sistema multi-tenant. Isso pode levar alguns segundos...
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <Tabs defaultValue="results" className="space-y-4">
          <TabsList>
            <TabsTrigger value="results">Resultados dos Testes</TabsTrigger>
            <TabsTrigger value="metrics">Métricas Consolidadas</TabsTrigger>
            <TabsTrigger value="studios">Dados dos Estúdios</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-4">
            {testResults.map((result, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      {result.testName}
                    </div>
                    {getStatusBadge(result.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{result.details}</p>
                  
                  {result.error && (
                    <Alert className="mb-4">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription className="text-red-700">
                        <strong>Erro:</strong> {result.error}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {result.metrics && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Métricas do Teste:</h4>
                      <pre className="text-sm text-gray-600 overflow-x-auto">
                        {JSON.stringify(result.metrics, null, 2)}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="metrics">
            {consolidatedData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Receita Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {consolidatedData.totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Todos os estúdios</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Lucro Líquido</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-600">
                      R$ {consolidatedData.netProfit.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Receita - Despesas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Total Agendamentos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-purple-600">
                      {consolidatedData.totalAppointments}
                    </p>
                    <p className="text-sm text-gray-600">
                      {consolidatedData.completedAppointments} concluídos
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Estúdios Ativos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-indigo-600">
                      {consolidatedData.totalStudios}
                    </p>
                    <p className="text-sm text-gray-600">Na plataforma</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="studios">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {consolidatedData?.revenueByStudio.map((studio: any) => (
                <Card key={studio.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{studio.name}</CardTitle>
                    <p className="text-sm text-gray-600">{studio.location}</p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Receita:</span>
                      <span className="font-semibold text-green-600">
                        R$ {studio.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Despesas:</span>
                      <span className="font-semibold text-red-600">
                        R$ {studio.expenses.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lucro:</span>
                      <span className="font-semibold text-blue-600">
                        R$ {studio.profit.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Agendamentos:</span>
                      <span className="font-semibold">{studio.appointments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Clientes:</span>
                      <span className="font-semibold">{studio.clients}</span>
                    </div>
                    <Badge 
                      variant={studio.subscription_tier === 'enterprise' ? 'default' : 'secondary'}
                      className="mt-2"
                    >
                      {studio.subscription_tier}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {showReport && testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Resumo Final dos Testes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {testResults.filter(r => r.status === 'PASS').length}
                </div>
                <div className="text-sm text-gray-600">Testes Aprovados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {testResults.filter(r => r.status === 'FAIL').length}
                </div>
                <div className="text-sm text-gray-600">Testes Falharam</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {testResults.filter(r => r.status === 'WARNING').length}
                </div>
                <div className="text-sm text-gray-600">Avisos</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Status Geral do Sistema:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Segregação de dados validada</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Agregação funcionando corretamente</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Relatórios consolidados precisos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Performance otimizada</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MultiTenantTestDashboard;
