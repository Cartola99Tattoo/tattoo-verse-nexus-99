
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface BlogSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const BlogSearchInput: React.FC<BlogSearchInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Search blog posts..." 
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};

export default BlogSearchInput;
