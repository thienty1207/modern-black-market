import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'sonner';

const Layout = () => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden w-full">
      <Navbar />
      {/* Padding top ensures content doesn't hide under fixed navbar */}
      <main className="flex-grow pt-14 md:pt-16 w-full max-w-full overflow-x-hidden">
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
            maxWidth: '90vw', // Make sure toast doesn't overflow on mobile
          }
        }}
      />
    </div>
  );
};

export default Layout;
