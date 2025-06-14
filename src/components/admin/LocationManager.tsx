
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Plus, X } from 'lucide-react';
import { Control } from 'react-hook-form';

interface LocationManagerProps {
  control: Control<any>;
  name: string;
  currentLocations?: string[];
}

const commonCities = [
  'São Paulo, SP',
  'Rio de Janeiro, RJ',
  'Belo Horizonte, MG',
  'Brasília, DF',
  'Salvador, BA',
  'Fortaleza, CE',
  'Curitiba, PR',
  'Recife, PE',
  'Porto Alegre, RS',
  'Goiânia, GO',
  'Belém, PA',
  'Manaus, AM',
  'Campo Grande, MS',
  'Teresina, PI',
  'São Luís, MA'
];

const LocationManager = ({ control, name, currentLocations = [] }: LocationManagerProps) => {
  const [newLocation, setNewLocation] = useState('');

  return (
    <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-xl font-black">
          <MapPin className="h-5 w-5" />
          Locais de Atendimento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-green-800 font-bold">Cidades e Estados onde Atende</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {/* Localizações atuais */}
                  <div className="flex flex-wrap gap-2">
                    {field.value?.map((location: string, index: number) => (
                      <Badge key={index} className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow-lg flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {location}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:bg-green-700 rounded-full ml-1" 
                          onClick={() => {
                            const newLocations = field.value.filter((_: string, i: number) => i !== index);
                            field.onChange(newLocations);
                          }}
                        />
                      </Badge>
                    )) || []}
                  </div>

                  {/* Cidades sugeridas */}
                  <div>
                    <p className="text-sm text-green-700 font-medium mb-2">Cidades Populares:</p>
                    <div className="flex flex-wrap gap-2">
                      {commonCities
                        .filter(city => !field.value?.includes(city))
                        .slice(0, 8)
                        .map((city) => (
                          <Button
                            key={city}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const currentLocations = field.value || [];
                              if (!currentLocations.includes(city)) {
                                field.onChange([...currentLocations, city]);
                              }
                            }}
                            className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 transition-all duration-200"
                          >
                            + {city}
                          </Button>
                        ))}
                    </div>
                  </div>

                  {/* Adicionar localização personalizada */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ex: Campinas, SP"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newLocation.trim()) {
                            const currentLocations = field.value || [];
                            if (!currentLocations.includes(newLocation.trim())) {
                              field.onChange([...currentLocations, newLocation.trim()]);
                              setNewLocation('');
                            }
                          }
                        }
                      }}
                      className="border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    />
                    <Button 
                      type="button" 
                      onClick={() => {
                        if (newLocation.trim()) {
                          const currentLocations = field.value || [];
                          if (!currentLocations.includes(newLocation.trim())) {
                            field.onChange([...currentLocations, newLocation.trim()]);
                            setNewLocation('');
                          }
                        }
                      }}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </FormControl>
              <FormDescription className="text-green-600">
                Adicione as cidades e estados onde o tatuador atende clientes
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default LocationManager;
