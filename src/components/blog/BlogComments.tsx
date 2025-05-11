
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useBlogComments, useCreateComment } from "@/hooks/useBlog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/components/ui/use-toast";

interface BlogCommentsProps {
  postId: string;
}

const BlogComments = ({ postId }: BlogCommentsProps) => {
  const { session } = useAuth();
  const { data: comments, isLoading } = useBlogComments(postId);
  const { mutate: createComment, isPending } = useCreateComment();
  
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    createComment(
      { 
        postId, 
        content 
      },
      {
        onSuccess: () => {
          setContent("");
          toast({
            title: "Comentário enviado com sucesso!",
            description: "Seu comentário será exibido após aprovação.",
          });
        },
        onError: (error) => {
          toast({
            title: "Erro ao enviar comentário",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleSubmitReply = (parentId: string) => {
    if (!replyContent.trim()) return;
    
    createComment(
      { 
        postId, 
        content: replyContent,
        parentId
      },
      {
        onSuccess: () => {
          setReplyTo(null);
          setReplyContent("");
          toast({
            title: "Resposta enviada com sucesso!",
            description: "Sua resposta será exibida após aprovação.",
          });
        },
        onError: (error) => {
          toast({
            title: "Erro ao enviar resposta",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleCancel = () => {
    setReplyTo(null);
    setReplyContent("");
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando comentários...</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-6">Comentários</h3>
      
      {/* Formulário para novo comentário */}
      {session ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <Textarea
            placeholder="Deixe seu comentário..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mb-3 resize-none h-24"
          />
          <Button type="submit" disabled={isPending || !content.trim()}>
            {isPending ? "Enviando..." : "Enviar comentário"}
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            * Seu comentário será exibido após aprovação.
          </p>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 rounded-md mb-8">
          <p className="text-gray-700">
            <a href="/auth" className="text-red-500 hover:underline">
              Faça login
            </a>{" "}
            para deixar um comentário.
          </p>
        </div>
      )}

      {/* Lista de comentários */}
      {comments?.length ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={comment.user?.avatar_url} />
                  <AvatarFallback>
                    {comment.user?.first_name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">
                        {comment.user 
                          ? `${comment.user.first_name || ''} ${comment.user.last_name || ''}`.trim() 
                          : 'Usuário'}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {format(new Date(comment.created_at), "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    {session && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setReplyTo(comment.id)}
                        className="text-sm"
                      >
                        Responder
                      </Button>
                    )}
                  </div>
                  <p className="mt-2 text-gray-700">{comment.content}</p>
                  
                  {/* Formulário de resposta */}
                  {replyTo === comment.id && (
                    <div className="mt-4">
                      <Textarea
                        placeholder="Escreva sua resposta..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="mb-3 resize-none"
                      />
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleSubmitReply(comment.id)} 
                          disabled={isPending || !replyContent.trim()}
                        >
                          {isPending ? "Enviando..." : "Enviar"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Respostas */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 pl-6 border-l-2 border-gray-200 space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="bg-white rounded p-3">
                          <div className="flex items-start gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={reply.user?.avatar_url} />
                              <AvatarFallback className="text-xs">
                                {reply.user?.first_name?.[0] || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div>
                                <span className="font-medium text-sm">
                                  {reply.user 
                                    ? `${reply.user.first_name || ''} ${reply.user.last_name || ''}`.trim() 
                                    : 'Usuário'}
                                </span>
                                <span className="text-xs text-gray-500 ml-2">
                                  {format(new Date(reply.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-gray-700">{reply.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Ainda não há comentários. Seja o primeiro a comentar!
        </div>
      )}
    </div>
  );
};

export default BlogComments;
