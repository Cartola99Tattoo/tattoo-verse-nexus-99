
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckboxGroup, CheckboxItem } from "@/components/ui/checkbox"; 
import { useToast } from "@/hooks/use-toast";
import useTracking from "@/hooks/useTracking";

interface QualificationFormProps {
  onSuccess?: () => void;
  context?: string;
  compact?: boolean;
  artistId?: string;
}

const QualificationForm = ({ 
  onSuccess, 
  context = "general", 
  compact = false,
  artistId 
}: QualificationFormProps) => {
  const { toast } = useToast();
  const { trackEvent, updateQualification } = useTracking();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [bodyLocation, setBodyLocation] = useState<string>("");
  const [contactPreference, setContactPreference] = useState<string>("whatsapp");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!name || !email || !phone) {
      toast({
        title: "Preencha todos os campos obrigatórios",
        description: "Nome, e-mail e telefone são necessários para entrarmos em contato.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Track the qualification submission
      trackEvent('contact', {
        context,
        artistId,
        interests,
        timeframe,
        budget,
        bodyLocation,
        contactPreference
      });
      
      // Update user qualification data
      updateQualification({
        interestedIn: interests,
        timeframe,
        budget,
        bodyLocation,
        contactPreference
      });
      
      // In a real implementation, this would send data to the server
      // We'll simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Mensagem enviada com sucesso!",
        description: "Em breve entraremos em contato com você.",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setInterests([]);
      setTimeframe("");
      setBudget("");
      setBodyLocation("");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Ocorreu um problema ao processar sua solicitação. Tente novamente mais tarde.",
        variant: "destructive"
      });
      console.error("Error submitting contact form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={compact ? "shadow-sm" : "shadow-md"}>
      <CardHeader className={compact ? "p-4" : "p-6"}>
        <CardTitle className={compact ? "text-lg" : "text-2xl"}>
          {context === "artist" 
            ? "Entre em contato com este tatuador" 
            : "Queremos conhecer melhor você!"}
        </CardTitle>
        <CardDescription>
          {context === "artist" 
            ? "A 99Tattoo fará a intermediação do seu contato com o artista"
            : "Preencha o formulário abaixo para que possamos oferecer a melhor experiência"}
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className={`space-y-4 ${compact ? "p-4" : "p-6"}`}>
          {/* Basic contact info */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo *</Label>
            <Input 
              id="name" 
              placeholder="Digite seu nome" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone (WhatsApp) *</Label>
              <Input 
                id="phone" 
                type="tel" 
                placeholder="(00) 00000-0000" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                required 
              />
            </div>
          </div>
          
          {/* Qualification questions */}
          <div className="space-y-2">
            <Label>Qual tipo de tatuagem você está buscando?</Label>
            <div className="grid grid-cols-2 gap-2">
              {["Realismo", "Blackwork", "Aquarela", "Geométrico", "Old School", "Minimalista"].map((style) => (
                <div key={style}>
                  <CheckboxItem 
                    id={`interest-${style}`}
                    checked={interests.includes(style)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setInterests([...interests, style]);
                      } else {
                        setInterests(interests.filter(i => i !== style));
                      }
                    }}
                  >
                    {style}
                  </CheckboxItem>
                </div>
              ))}
            </div>
          </div>
          
          {!compact && (
            <>
              <div className="space-y-2">
                <Label>Qual o seu orçamento aproximado?</Label>
                <RadioGroup value={budget} onValueChange={setBudget}>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ate-300" id="budget-1" />
                      <Label htmlFor="budget-1">Até R$ 300</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="300-500" id="budget-2" />
                      <Label htmlFor="budget-2">R$ 300 a R$ 500</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="500-1000" id="budget-3" />
                      <Label htmlFor="budget-3">R$ 500 a R$ 1000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="acima-1000" id="budget-4" />
                      <Label htmlFor="budget-4">Acima de R$ 1000</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label>Quando você pretende fazer a tatuagem?</Label>
                <RadioGroup value={timeframe} onValueChange={setTimeframe}>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="urgente" id="time-1" />
                      <Label htmlFor="time-1">O mais rápido possível</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1-month" id="time-2" />
                      <Label htmlFor="time-2">Próximo mês</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3-months" id="time-3" />
                      <Label htmlFor="time-3">Próximos 3 meses</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="later" id="time-4" />
                      <Label htmlFor="time-4">Sem pressa</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label>Qual região do corpo você pretende tatuar?</Label>
                <Input 
                  placeholder="Ex: braço, perna, costas..." 
                  value={bodyLocation} 
                  onChange={(e) => setBodyLocation(e.target.value)}
                />
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="message">Sua mensagem (opcional)</Label>
            <Textarea 
              id="message" 
              placeholder="Descreva o que você tem em mente..."
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Como prefere ser contatado?</Label>
            <RadioGroup defaultValue="whatsapp" value={contactPreference} onValueChange={setContactPreference}>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="whatsapp" id="contact-1" />
                  <Label htmlFor="contact-1">WhatsApp</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="contact-2" />
                  <Label htmlFor="contact-2">Ligação</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="contact-3" />
                  <Label htmlFor="contact-3">E-mail</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        
        <CardFooter className={compact ? "p-4" : "p-6"}>
          <Button 
            type="submit" 
            className="w-full bg-red-500 hover:bg-red-600" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar mensagem"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default QualificationForm;
