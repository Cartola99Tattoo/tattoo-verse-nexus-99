
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Edit, 
  MoreHorizontal, 
  Eye, 
  Trash, 
  Copy,
  Clock, 
  CheckCircle2 
} from "lucide-react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { BlogPost } from '@/types/blog';

interface BlogPostTableProps {
  posts: BlogPost[];
  onDelete: (id: string) => void;
}

const BlogPostTable: React.FC<BlogPostTableProps> = ({ posts, onDelete }) => {
  // Format date helper
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  // Determine post status
  const getPostStatus = (post: BlogPost) => {
    if (post.is_draft) return "draft";
    if (!post.published_at) return "draft";
    
    const publishDate = new Date(post.published_at);
    const now = new Date();
    
    if (publishDate > now) return "scheduled";
    return "published";
  };

  // Get author name helper
  const getAuthorName = (post: BlogPost) => {
    if (!post.profiles) return "Unknown";
    
    const firstName = post.profiles.first_name || "";
    const lastName = post.profiles.last_name || "";
    
    return `${firstName} ${lastName}`.trim() || "Unknown";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No posts found
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="font-medium">{post.title}</span>
                    <span className="text-xs text-gray-500 truncate max-w-[250px]">
                      {post.excerpt || "No excerpt"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{getAuthorName(post)}</TableCell>
                <TableCell>{post.blog_categories?.name || "Uncategorized"}</TableCell>
                <TableCell className="text-center">
                  {getPostStatus(post) === "published" && (
                    <Badge className="bg-green-500">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Published
                    </Badge>
                  )}
                  {getPostStatus(post) === "scheduled" && (
                    <Badge variant="outline" className="border-amber-500 text-amber-500">
                      <Clock className="h-3 w-3 mr-1" />
                      Scheduled
                    </Badge>
                  )}
                  {getPostStatus(post) === "draft" && (
                    <Badge variant="outline" className="border-gray-500 text-gray-500">
                      Draft
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{formatDate(post.created_at)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/admin/blog/edit/${post.id}`} className="flex items-center cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/blog/${post.slug || post.id}`} target="_blank" className="flex items-center cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigator.clipboard.writeText(`${window.location.origin}/blog/${post.slug || post.id}`)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy URL
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600 focus:text-red-600" 
                        onClick={() => onDelete(post.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BlogPostTable;
