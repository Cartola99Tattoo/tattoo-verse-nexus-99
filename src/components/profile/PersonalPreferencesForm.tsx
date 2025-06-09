
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Music, Film, BookOpen, Smile } from "lucide-react";
import { PersonalPreferences } from "@/services/mock/mockUserProfileService";

interface PersonalPreferencesFormProps {
  preferences: PersonalPreferences;
  onUpdate: (preferences: Partial<PersonalPreferences>) => void;
  isLoading?: boolean;
}

const PersonalPreferencesForm: React.FC<PersonalPreferencesFormProps> = ({ 
  preferences, 
  onUpdate, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<PersonalPreferences>(preferences);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const musicGenres = [
    "Rock", "Pop", "Eletrônica", "Clássica", "MPB", "Hip-Hop", 
    "Sertanejo", "Metal", "Jazz", "Blues", "Reggae", "Funk", 
    "Gospel", "Country", "Indie", "Outro"
  ];

  const movieSeriesGenres = [
    "Ficção Científica", "Fantasia", "Drama", "Ação", "Terror", 
    "Comédia", "Documentário", "Anime", "Romance", "Suspense",
    "Thriller", "Histórico", "Aventura", "Crime", "Musical", "Guerra", "Biografia"
  ];

  const personalityTypes = [
    "Introvertido", "Extrovertido", "Observador", "Aventureiro", 
    "Criativo", "Analítico", "Empático", "Liderança", "Sonhador"
  ];

  const toggleArrayItem = (array: string[], item: string, setter: (newArray: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
      <CardHeader>
        <CardTitle className="text-red-600 flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Gostos e Preferências Pessoais
        </CardTitle>
        <p className="text-gray-600 text-sm">
          Essas informações nos ajudam a entender melhor seu perfil e personalizar sua experiência
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Gostos Musicais */}
          <div>
            <Label className="text-red-600 font-medium mb-3 block flex items-center gap-2">
              <Music className="h-4 w-4" />
              Gostos Musicais
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {musicGenres.map(genre => (
                <div key={genre} className="flex items-center space-x-2">
                  <Checkbox
                    id={`music-${genre}`}
                    checked={formData.music_genres.includes(genre)}
                    onCheckedChange={() => 
                      toggleArrayItem(
                        formData.music_genres, 
                        genre, 
                        (newArray) => setFormData(prev => ({ ...prev, music_genres: newArray }))
                      )
                    }
                  />
                  <Label htmlFor={`music-${genre}`} className="text-sm cursor-pointer">
                    {genre}
                  </Label>
                </div>
              ))}
            </div>
            {formData.music_genres.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {formData.music_genres.map(genre => (
                  <Badge key={genre} variant="outline" className="border-red-200 text-red-600">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Estilos de Filmes/Séries */}
          <div>
            <Label className="text-red-600 font-medium mb-3 block flex items-center gap-2">
              <Film className="h-4 w-4" />
              Estilos de Filmes/Séries Favoritos
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {movieSeriesGenres.map(genre => (
                <div key={genre} className="flex items-center space-x-2">
                  <Checkbox
                    id={`movie-${genre}`}
                    checked={formData.movie_series_genres.includes(genre)}
                    onCheckedChange={() => 
                      toggleArrayItem(
                        formData.movie_series_genres, 
                        genre, 
                        (newArray) => setFormData(prev => ({ ...prev, movie_series_genres: newArray }))
                      )
                    }
                  />
                  <Label htmlFor={`movie-${genre}`} className="text-sm cursor-pointer">
                    {genre}
                  </Label>
                </div>
              ))}
            </div>
            {formData.movie_series_genres.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {formData.movie_series_genres.map(genre => (
                  <Badge key={genre} variant="outline" className="border-red-200 text-red-600">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Livros/Autores Favoritos */}
          <div>
            <Label className="text-red-600 font-medium mb-2 block flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Livros/Autores Favoritos
            </Label>
            <Textarea
              value={formData.favorite_books}
              onChange={(e) => setFormData(prev => ({ ...prev, favorite_books: e.target.value }))}
              placeholder="Ex: 1984 - George Orwell, O Senhor dos Anéis - J.R.R. Tolkien..."
              rows={2}
              className="border-red-200 focus:border-red-600"
            />
          </div>

          {/* Hobbies e Interesses */}
          <div>
            <Label className="text-red-600 font-medium mb-2 block">
              Hobbies e Interesses
            </Label>
            <Textarea
              value={formData.hobbies_interests}
              onChange={(e) => setFormData(prev => ({ ...prev, hobbies_interests: e.target.value }))}
              placeholder="Ex: Viagens, jogos, culinária, esportes, natureza, fotografia, artesanato, música, tecnologia, filosofia..."
              rows={2}
              className="border-red-200 focus:border-red-600"
            />
          </div>

          {/* Tipo de Personalidade */}
          <div>
            <Label className="text-red-600 font-medium mb-2 block flex items-center gap-2">
              <Smile className="h-4 w-4" />
              Tipo de Personalidade
            </Label>
            <Select 
              value={formData.personality_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, personality_type: value }))}
            >
              <SelectTrigger className="border-red-200 focus:border-red-600">
                <SelectValue placeholder="Como você se define?" />
              </SelectTrigger>
              <SelectContent>
                {personalityTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Curiosidade sobre Você */}
          <div>
            <Label className="text-red-600 font-medium mb-2 block">
              Uma Curiosidade sobre Você
            </Label>
            <Textarea
              value={formData.curiosity_about_you}
              onChange={(e) => setFormData(prev => ({ ...prev, curiosity_about_you: e.target.value }))}
              placeholder="Conte algo interessante sobre você que poucos sabem..."
              rows={3}
              className="border-red-200 focus:border-red-600"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg hover:shadow-xl"
          >
            {isLoading ? "Salvando..." : "Salvar Preferências Pessoais"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalPreferencesForm;
