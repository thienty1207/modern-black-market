import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'sonner';

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen w-full">
      {isHomePage && (
        <div className="absolute top-0 left-0 right-0 h-[70vh] bg-gradient-to-b from-black/40 to-transparent z-0"></div>
      )}
      <Navbar />
      {/* Adjust main content positioning */}
      <main className={`flex-grow w-full max-w-full overflow-x-hidden ${isHomePage ? '' : 'pt-14 md:pt-16'}`}>
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
