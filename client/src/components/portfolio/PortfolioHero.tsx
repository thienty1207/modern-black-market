import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download, Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const PortfolioHero = () => {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-20 left-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </motion.div>

      <div className="container-custom relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-6 px-4 py-2 rounded-full bg-accent/20 backdrop-blur-md border border-accent/20"
        >
          <span className="text-sm font-medium text-accent-foreground">👋 Chào mừng đến với portfolio của tôi</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 tracking-tight bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent"
        >
          Trần Văn B
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl lg:text-3xl font-semibold mb-4 text-accent"
        >
          Frontend Developer
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl lg:text-2xl mb-12 text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        >
          Tạo ra những giao diện đẹp mắt và hiệu năng cao.<br />
          Chuyên về React, TypeScript và thiết kế UI/UX hiện đại.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button
            size="lg"
            onClick={scrollToProjects}
            className="group relative overflow-hidden bg-gradient-to-r from-accent to-secondary hover:shadow-glow transition-all duration-300 rounded-full px-8 py-3"
          >
            <span className="relative z-10 flex items-center">
              Khám phá dự án
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={scrollToContact}
            className="group border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all duration-300 rounded-full px-8 py-3"
          >
            <span className="flex items-center">
              Liên hệ ngay
              <Mail className="ml-2 h-4 w-4" />
            </span>
          </Button>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-6"
        >
          <a
            href="https://github.com/username"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-muted/50 hover:bg-accent/20 hover:shadow-glow transition-all duration-300 group"
          >
            <Github className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
          </a>
          <a
            href="https://linkedin.com/in/username"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-muted/50 hover:bg-accent/20 hover:shadow-glow transition-all duration-300 group"
          >
            <Linkedin className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
          </a>
          <a
            href="mailto:example@gmail.com"
            className="p-3 rounded-full bg-muted/50 hover:bg-accent/20 hover:shadow-glow transition-all duration-300 group"
          >
            <Mail className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
          </a>
          <Button
            variant="ghost"
            size="sm"
            className="p-3 rounded-full bg-muted/50 hover:bg-accent/20 hover:shadow-glow transition-all duration-300 group"
          >
            <Download className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 border-2 border-accent/50 rounded-full p-1">
          <div className="w-1 h-3 bg-accent/70 rounded-full mx-auto animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
};

export default PortfolioHero;