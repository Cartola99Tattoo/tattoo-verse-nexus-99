
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '@/components/admin/AdminLayout';
import BlogPostTable from '@/components/admin/blog/BlogPostTable';
import BlogFilters from '@/components/admin/blog/BlogFilters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BlogCategoryManagement from '@/components/admin/blog/BlogCategoryManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminBlog = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('posts');

  return (
    <AdminLayout>
      <Helmet>
        <title>Gerenciamento de Blog | 99Tattoo Admin</title>
      </Helmet>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold">Gerenciamento de Blog</h1>
          {activeTab === 'posts' && (
            <Button 
              onClick={() => navigate('/admin/blog/new')} 
              className="mt-4 md:mt-0"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Artigo
            </Button>
          )}
        </div>

        <Tabs 
          defaultValue="posts" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="posts">Artigos</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="comments">Comentários</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            <BlogFilters />
            <BlogPostTable />
          </TabsContent>
          
          <TabsContent value="categories">
            <BlogCategoryManagement />
          </TabsContent>
          
          <TabsContent value="comments">
            <div className="bg-white rounded-md shadow p-6">
              <h2 className="text-xl font-medium mb-4">Gerenciamento de Comentários</h2>
              <p className="text-gray-500">
                Funcionalidade de gerenciamento de comentários em desenvolvimento.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="bg-white rounded-md shadow p-6">
              <h2 className="text-xl font-medium mb-4">Estatísticas do Blog</h2>
              <p className="text-gray-500">
                Funcionalidade de estatísticas em desenvolvimento.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminBlog;
