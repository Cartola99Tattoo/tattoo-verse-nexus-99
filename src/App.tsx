
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { HelmetProvider } from 'react-helmet-async';

// Pages
import Home from '@/pages/Home';
import BlogList from '@/pages/blog/BlogList';
import BlogPost from '@/pages/blog/BlogPost';
import AdminBlog from '@/pages/admin/Blog';
import BlogPostEditor from '@/pages/admin/BlogPostEditor';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/admin/blog" element={<AdminBlog />} />
            <Route path="/admin/blog/new" element={<BlogPostEditor />} />
            <Route path="/admin/blog/edit/:id" element={<BlogPostEditor />} />
          </Routes>
          <Toaster />
        </div>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
