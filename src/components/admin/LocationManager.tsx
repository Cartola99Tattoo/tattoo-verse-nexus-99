
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Plus, X } from 'lucide-react';

interface LocationManagerProps {
  locations: string[];
  onLocationsUpdate: (locations: string[]) => void;
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

const LocationManager = ({ locations, onLocationsUpdate }: LocationManagerProps) => {
  const [newLocation, setNewLocation] = useState('');

  const addLocation = (location: string) => {
    if (location.trim() && !locations.includes(location.trim())) {
      onLocationsUpdate([...locations, location.trim()]);
      setNewLocation('');
    }
  };

  const removeLocation = (index: number) => {
    const updatedLocations = locations.filter((_, i) => i !== index);
    onLocationsUpdate(updatedLocations);
  };

  return (
    <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-xl font-black">
          <MapPin className="h-5 w-5" />
          Locais de Atendimento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-4">
          {/* Localizações atuais */}
          <div className="flex flex-wrap gap-2">
            {locations.map((location, index) => (
              <Badge key={index} className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow-lg flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {location}
                <X 
                  className="h-3 w-3 cursor-pointer hover:bg-green-700 rounded-full ml-1" 
                  onClick={() => removeLocation(index)}
                />
              </Badge>
            ))}
          </div>

          {/* Cidades sugeridas */}
          <div>
            <p className="text-sm text-green-700 font-medium mb-2">Cidades Populares:</p>
            <div className="flex flex-wrap gap-2">
              {commonCities
                .filter(city => !locations.includes(city))
                .slice(0, 8)
                .map((city) => (
                  <Button
                    key={city}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addLocation(city)}
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
                  addLocation(newLocation);
                }
              }}
              className="border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200"
            />
            <Button 
              type="button" 
              onClick={() => addLocation(newLocation)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationManager;
