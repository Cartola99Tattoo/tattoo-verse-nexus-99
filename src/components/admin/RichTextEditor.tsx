
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Bold, Italic, List, Link, Image, Code, Eye } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);

  const insertFormatting = (format: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = '';
    
    switch (format) {
      case 'bold':
        newText = `**${selectedText}**`;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        break;
      case 'h2':
        newText = `## ${selectedText || 'Título'}`;
        break;
      case 'h3':
        newText = `### ${selectedText || 'Subtítulo'}`;
        break;
      case 'list':
        newText = `\n- ${selectedText || 'Item da lista'}`;
        break;
      case 'link':
        newText = `[${selectedText || 'texto do link'}](url)`;
        break;
      case 'image':
        newText = `![alt text](url-da-imagem)`;
        break;
      case 'code':
        newText = `\`${selectedText}\``;
        break;
      default:
        newText = selectedText;
    }

    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);

    // Restore focus and cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + newText.length, start + newText.length);
    }, 0);
  };

  const renderPreview = (markdown: string) => {
    // Simple markdown to HTML conversion for preview
    return markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/### (.*?)$/gm, '<h3>$1</h3>')
      .replace(/## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/# (.*?)$/gm, '<h1>$1</h1>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n- (.*?)$/gm, '<li>$1</li>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />')
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
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('italic')}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('h2')}
            >
              H2
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('h3')}
            >
              H3
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('link')}
            >
              <Link className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('image')}
            >
              <Image className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertFormatting('code')}
            >
              <Code className="h-4 w-4" />
            </Button>
            <div className="ml-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsPreview(!isPreview)}
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

          {/* Helper text */}
          <div className="text-sm text-gray-500">
            <p><strong>Dicas de formatação:</strong></p>
            <p>**negrito** • *itálico* • ## Título 2 • ### Título 3 • [link](url) • ![imagem](url)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RichTextEditor;
