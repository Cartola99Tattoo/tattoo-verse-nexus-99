
import React, { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 bg-gray-100">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
