
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Eye } from "lucide-react";

interface BlogPreviewProps {
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  tags: string[];
  category?: string;
  onClose: () => void;
}

const BlogPreview = ({ title, content, excerpt, coverImage, tags, category, onClose }: BlogPreviewProps) => {
  const renderPreview = (markdown: string) => {
    return markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/### (.*?)$/gm, '<h3 class="text-xl font-semibold mb-3 mt-6">$1</h3>')
      .replace(/## (.*?)$/gm, '<h2 class="text-2xl font-bold mb-4 mt-8">$1</h2>')
      .replace(/# (.*?)$/gm, '<h1 class="text-3xl font-bold mb-6 mt-10">$1</h1>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>')
      .replace(/\n- (.*?)$/gm, '<li class="ml-4">$1</li>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-red-600 hover:text-red-800 underline">$1</a>')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg shadow-md my-4" />')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-red-600" />
            <CardTitle>Pré-visualização do Artigo</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)] p-8">
          <article className="prose max-w-none">
            {/* Header do artigo */}
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
              
              {excerpt && (
                <p className="text-xl text-gray-600 mb-4 italic">{excerpt}</p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <span>Por: Equipe 99Tattoo</span>
                <span>•</span>
                <span>{new Date().toLocaleDateString('pt-BR')}</span>
                {category && (
                  <>
                    <span>•</span>
                    <span className="text-red-600">{category}</span>
                  </>
                )}
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {coverImage && (
                <img
                  src={coverImage}
                  alt={title}
                  className="w-full h-64 object-cover rounded-lg shadow-lg mb-8"
                />
              )}
            </header>

            {/* Conteúdo do artigo */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: renderPreview(content) }}
            />
          </article>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogPreview;
