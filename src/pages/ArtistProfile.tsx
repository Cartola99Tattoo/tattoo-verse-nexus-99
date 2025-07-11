
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Star, Instagram, Facebook, Phone, Mail, Calendar, Award, Clock } from "lucide-react";

const artistData = {
  id: 1,
  name: "Mariana Silva",
  specialty: "Realismo",
  location: "São Paulo, SP",
  rating: 4.9,
  reviews: 127,
  image: "https://images.unsplash.com/photo-1594736797933-d0589ba2fe65?q=80&w=1974&auto=format&fit=crop",
  styles: ["Realismo", "Retrato", "Preto e Cinza", "Fine Line"],
  experience: "8 anos",
  instagram: "@mariana_tattoo",
  facebook: "Mariana Silva Tattoo",
  phone: "(11) 99999-9999",
  email: "mariana@99tattoo.com",
  bio: "Especialista em tatuagens realistas e retratos, com mais de 8 anos de experiência transformando memórias em arte permanente. Formada em Artes Visuais, sempre busco capturar a essência e emoção em cada trabalho.",
  portfolio: [
    "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1543767271-7c5f36dc5310?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1562962230-16e4623d36e7?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=1974&auto=format&fit=crop"
  ],
  schedule: "Segunda a Sexta: 9h às 18h",
  awards: ["Melhor Tatuador Realista 2023", "Prêmio Inovação Tattoo SP 2022"],
  priceRange: "R$ 200 - R$ 800"
};

const ArtistProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/artists')}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Artistas
          </Button>
          
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-shrink-0">
              <img
                src={artistData.image}
                alt={artistData.name}
                className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-white shadow-2xl"
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {artistData.name}
              </h1>
              <p className="text-xl text-red-100 mb-4">{artistData.specialty}</p>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-red-200" />
                  <span className="text-red-100">{artistData.location}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-1 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-medium">{artistData.rating}</span>
                  <span className="text-red-100 ml-1">({artistData.reviews} avaliações)</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-red-200" />
                  <span className="text-red-100">{artistData.experience} de experiência</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {artistData.styles.map(style => (
                  <Badge key={style} variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                    {style}
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Consulta
                </Button>
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <Instagram className="h-4 w-4 mr-2" />
                  Instagram
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Portfolio Section */}
            <section>
              <h2 className="text-3xl font-bold text-red-600 mb-6">Portfólio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {artistData.portfolio.map((image, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-red-glow transition-all duration-300 transform hover:scale-105"
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`Trabalho ${index + 1}`}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Biography Section */}
            <Card variant="tattoo" className="shadow-xl">
              <CardHeader variant="red">
                <CardTitle className="text-2xl font-bold text-red-600">Biografia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg">{artistData.bio}</p>
              </CardContent>
            </Card>

            {/* Estilos Section */}
            <Card variant="tattoo" className="shadow-xl">
              <CardHeader variant="red">
                <CardTitle className="text-2xl font-bold text-red-600">Estilos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {artistData.styles.map(style => (
                    <Badge key={style} variant="tattooOutline" className="justify-center py-2 text-center">
                      {style}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card variant="tattooRed" className="shadow-xl">
              <CardHeader variant="red">
                <CardTitle className="text-xl font-bold text-red-600">Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-red-500" />
                  <span className="text-gray-700">{artistData.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-red-500" />
                  <span className="text-gray-700">{artistData.email}</span>
                </div>
                <div className="flex items-center">
                  <Instagram className="h-5 w-5 mr-3 text-red-500" />
                  <span className="text-gray-700">{artistData.instagram}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-red-500" />
                  <span className="text-gray-700">{artistData.schedule}</span>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card variant="tattooRed" className="shadow-xl">
              <CardHeader variant="red">
                <CardTitle className="text-xl font-bold text-red-600">Valores</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600 mb-2">{artistData.priceRange}</p>
                <p className="text-gray-600 text-sm">
                  Valores variam conforme tamanho e complexidade. Consulta gratuita.
                </p>
              </CardContent>
            </Card>

            {/* Awards */}
            <Card variant="tattooRed" className="shadow-xl">
              <CardHeader variant="red">
                <CardTitle className="text-xl font-bold text-red-600 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Prêmios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {artistData.awards.map((award, index) => (
                    <li key={index} className="flex items-start">
                      <Star className="h-4 w-4 mr-2 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{award}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card variant="tattoo" className="shadow-xl">
              <CardContent className="p-6 text-center">
                <Button variant="tattoo" size="lg" className="w-full shadow-lg hover:shadow-xl">
                  <Calendar className="h-5 w-5 mr-2" />
                  Agendar Consulta
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;
