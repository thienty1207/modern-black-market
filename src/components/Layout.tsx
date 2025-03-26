
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'sonner';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          className: "neo-blur",
          duration: 3000,
          style: {
            background: 'rgba(23, 23, 23, 0.9)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      />
    </div>
  );
};

export default Layout;
