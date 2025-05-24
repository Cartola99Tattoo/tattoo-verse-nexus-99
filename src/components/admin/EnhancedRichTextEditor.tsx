
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bold, Italic, List, Link, Image, Code, Eye, Upload } from "lucide-react";

interface EnhancedRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const EnhancedRichTextEditor = ({ value, onChange }: EnhancedRichTextEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');

  const insertFormatting = (format: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = '';
    
    switch (format) {
      case 'bold':
        newText = `**${selectedText || 'texto em negrito'}**`;
        break;
      case 'italic':
        newText = `*${selectedText || 'texto em itálico'}*`;
        break;
      case 'h2':
        newText = `## ${selectedText || 'Título Principal'}`;
        break;
      case 'h3':
        newText = `### ${selectedText || 'Subtítulo'}`;
        break;
      case 'list':
        newText = `\n- ${selectedText || 'Item da lista'}`;
        break;
      case 'link':
        newText = `[${selectedText || 'texto do link'}](https://exemplo.com)`;
        break;
      case 'code':
        newText = `\`${selectedText || 'código'}\``;
        break;
      default:
        newText = selectedText;
    }

    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      const newPosition = start + newText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const insertImage = () => {
    if (imageUrl && imageAlt) {
      const imageMarkdown = `![${imageAlt}](${imageUrl})`;
      const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
      
      if (textarea) {
        const start = textarea.selectionStart;
        const newValue = value.substring(0, start) + '\n' + imageMarkdown + '\n' + value.substring(start);
        onChange(newValue);
      }
      
      setImageUrl('');
      setImageAlt('');
      setShowImageDialog(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulação de upload - em produção, isso seria enviado para um servidor
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
      setImageAlt(file.name.split('.')[0]);
    }
  };

  const renderPreview = (markdown: string) => {
    return markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/### (.*?)$/gm, '<h3 class="text-xl font-semibold mb-3 mt-6">$1</h3>')
      .replace(/## (.*?)$/gm, '<h2 class="text-2xl font-bold mb-4 mt-8">$1</h2>')
      .replace(/# (.*?)$/gm, '<h1 class="text-3xl font-bold mb-6 mt-10">$1</h1>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>')
      .replace(/\n- (.*?)$/gm, '<li class="ml-4 mb-1">$1</li>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-red-600 hover:text-red-800 underline">$1</a>')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg shadow-md my-4" />')
      .replace(/\n/g, '<br />');
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-2 border-b pb-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('bold')}
              className="hover:bg-red-50"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('italic')}
              className="hover:bg-red-50"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('h2')}
              className="hover:bg-red-50"
            >
              H2
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('h3')}
              className="hover:bg-red-50"
            >
              H3
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('list')}
              className="hover:bg-red-50"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('link')}
              className="hover:bg-red-50"
            >
              <Link className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowImageDialog(true)}
              className="hover:bg-red-50"
            >
              <Image className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('code')}
              className="hover:bg-red-50"
            >
              <Code className="h-4 w-4" />
            </Button>
            <div className="ml-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsPreview(!isPreview)}
                className={isPreview ? "bg-red-100 text-red-800" : "hover:bg-red-50"}
              >
                <Eye className="h-4 w-4 mr-2" />
                {isPreview ? 'Editor' : 'Preview'}
              </Button>
            </div>
          </div>

          {/* Editor/Preview */}
          {isPreview ? (
            <div 
              className="min-h-[300px] p-4 border rounded-md bg-gray-50 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
            />
          ) : (
            <Textarea
              id="content-editor"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Escreva seu artigo aqui... Use Markdown para formatação."
              className="min-h-[300px] font-mono"
            />
          )}

          {/* Dialog para inserir imagem */}
          {showImageDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-md">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Inserir Imagem</h3>
                  
                  <div>
                    <Label htmlFor="image-upload">Upload de Arquivo</Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="image-url">Ou URL da Imagem</Label>
                    <Input
                      id="image-url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="image-alt">Texto Alternativo (Alt Text)</Label>
                    <Input
                      id="image-alt"
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                      placeholder="Descrição da imagem para acessibilidade"
                    />
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setShowImageDialog(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={insertImage}
                      disabled={!imageUrl || !imageAlt}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Inserir Imagem
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Helper text */}
          <div className="text-sm text-gray-500">
            <p><strong>Dicas de formatação:</strong></p>
            <p>**negrito** • *itálico* • ## Título 2 • ### Título 3 • [link](url) • Use o botão de imagem para inserir com texto alternativo</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedRichTextEditor;
