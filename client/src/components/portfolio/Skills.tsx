import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const Skills = () => {
  const skills = [
    { name: 'HTML', level: 95, icon: '🌐' },
    { name: 'CSS', level: 90, icon: '🎨' },
    { name: 'JavaScript', level: 88, icon: '⚡' },
    { name: 'React', level: 92, icon: '⚛️' },
    { name: 'TypeScript', level: 85, icon: '📘' },
    { name: 'Tailwind CSS', level: 90, icon: '💨' },
    { name: 'Git', level: 87, icon: '📚' },
    { name: 'Webpack', level: 80, icon: '📦' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="skills" className="py-20 px-4 md:px-8 bg-gradient-to-b from-secondary/5 to-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
            Kỹ Năng
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Công nghệ và kỹ năng tôi sử dụng để tạo ra những sản phẩm tuyệt vời
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group"
            >
              <Card className="bg-card/50 backdrop-blur border-border/50 hover:border-accent/50 transition-all duration-300 overflow-hidden">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-3">{skill.icon}</div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{skill.name}</h3>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="relative">
                    <div className="w-full bg-muted/30 rounded-full h-2 mb-2">
                      <motion.div
                        className="bg-gradient-to-r from-accent to-secondary h-2 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                      />
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-accent font-medium">{skill.level}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-accent/10 to-secondary/10 border-accent/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-center mb-6 text-accent">Kỹ năng khác</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  'Responsive Design', 'SEO Optimization', 'Performance Optimization',
                  'Testing', 'Debugging', 'Team Collaboration', 'Problem Solving',
                  'UI/UX Design', 'Figma', 'Adobe Creative Suite'
                ].map((skill) => (
                  <motion.span
                    key={skill}
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-card/50 backdrop-blur border border-border/50 rounded-full text-sm font-medium hover:border-accent/50 transition-all duration-300"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;