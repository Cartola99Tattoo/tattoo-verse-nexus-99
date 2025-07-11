
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabaseFinancialService } from "@/services/supabase/SupabaseFinancialService";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Users, DollarSign, TrendingUp, Calendar, Check } from "lucide-react";

const CommissionManagement = () => {
  const { data: commissions = [], isLoading: commissionsLoading } = useQuery({
    queryKey: ['artist-commissions-management'],
    queryFn: () => supabaseFinancialService.fetchArtistCommissions(),
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      calculated: "bg-blue-100 text-blue-800 border-blue-300",
      paid: "bg-green-100 text-green-800 border-green-300",
    };

    const labels = {
      pending: "Pendente",
      calculated: "Calculada",
      paid: "Pago",
    };

    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Gestão de Comissões
          </h2>
          <p className="text-gray-600">Controle de comissões pagas aos artistas</p>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-xl bg-gradient-to-br from-white to-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total Pago</p>
                <p className="text-2xl font-bold text-green-800">
                  {formatCurrency(
                    commissions
                      .filter(c => c.status === 'paid')
                      .reduce((sum, c) => sum + c.commission_amount, 0)
                  )}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-gradient-to-br from-white to-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Pendente</p>
                <p className="text-2xl font-bold text-blue-800">
                  {formatCurrency(
                    commissions
                      .filter(c => c.status !== 'paid')
                      .reduce((sum, c) => sum + c.commission_amount, 0)
                  )}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-gradient-to-br from-white to-purple-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Artistas Ativos</p>
                <p className="text-2xl font-bold text-purple-800">
                  {new Set(commissions.map(c => c.artist_id)).size}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Média por Artista</p>
                <p className="text-2xl font-bold text-red-800">
                  {formatCurrency(
                    commissions.length > 0 ? 
                    commissions.reduce((sum, c) => sum + c.commission_amount, 0) / new Set(commissions.map(c => c.artist_id)).size : 
                    0
                  )}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Comissões */}
      <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <CardTitle className="text-gray-800">Comissões de Artistas</CardTitle>
          <CardDescription>
            Histórico e gestão de todas as comissões
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Artista</TableHead>
                  <TableHead>Valor Base</TableHead>
                  <TableHead>Taxa</TableHead>
                  <TableHead>Comissão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissionsLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Carregando comissões...
                    </TableCell>
                  </TableRow>
                ) : commissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Nenhuma comissão encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  commissions.map((commission) => (
                    <TableRow key={commission.id} className="hover:bg-red-50/50 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-red-600" />
                          {commission.artist_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(commission.base_amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                          {(commission.commission_rate * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-green-700">
                        {formatCurrency(commission.commission_amount)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(commission.status)}
                      </TableCell>
                      <TableCell>
                        {formatDate(commission.created_at)}
                      </TableCell>
                      <TableCell>
                        {commission.status !== 'paid' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-green-200 text-green-600 hover:bg-green-50"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Marcar como Pago
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionManagement;
