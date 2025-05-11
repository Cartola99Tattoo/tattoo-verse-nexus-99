
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const data = [
  { name: '01', value: 2100 },
  { name: '05', value: 1500 },
  { name: '09', value: 4200 },
  { name: '13', value: 3100 },
  { name: '17', value: 5400 },
  { name: '21', value: 2900 },
  { name: '25', value: 6100 },
  { name: '29', value: 3800 },
];

// Fix the config structure to match the ChartConfig type
const config = {
  sales: {
    label: 'Vendas',
    color: '#8B5CF6'
  }
};

export default function SalesChart() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <ChartContainer config={config} className="aspect-auto h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            stroke="#888888"
            fontSize={12}
            tickFormatter={(value) => `Dia ${value}`}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            stroke="#888888"
            fontSize={12}
            tickFormatter={(value) => `R$${value / 1000}k`}
          />
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            fill="#8B5CF6"
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(label) => `Dia ${label}`}
                formatter={(value: number) => formatCurrency(value)}
              />
            }
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
