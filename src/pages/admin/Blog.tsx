
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlogFiltersState } from '@/types/blog';
import BlogCategoryManagement from '@/components/blog/admin/BlogCategoryManagement';
import BlogPostTable from '@/components/blog/admin/BlogPostTable';
import BlogFilters from '@/components/blog/filters/BlogFilters';

const AdminBlog = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('posts');
  const [filters, setFilters] = useState<BlogFiltersState>({});

  const handleFiltersChange = (newFilters: BlogFiltersState) => {
    setFilters(newFilters);
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Blog Management | 99Tattoo Admin</title>
      </Helmet>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold">Blog Management</h1>
          {activeTab === 'posts' && (
            <Button 
              onClick={() => navigate('/admin/blog/new')} 
              className="mt-4 md:mt-0"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Post
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
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            <BlogFilters onFiltersChange={handleFiltersChange} />
            <BlogPostTable filters={filters} />
          </TabsContent>
          
          <TabsContent value="categories">
            <BlogCategoryManagement />
          </TabsContent>
          
          <TabsContent value="comments">
            <div className="bg-white rounded-md shadow p-6">
              <h2 className="text-xl font-medium mb-4">Comment Management</h2>
              <p className="text-gray-500">
                Comment management functionality is under development.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="bg-white rounded-md shadow p-6">
              <h2 className="text-xl font-medium mb-4">Blog Statistics</h2>
              <p className="text-gray-500">
                Statistics functionality is under development.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminBlog;
