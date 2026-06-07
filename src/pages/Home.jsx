import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import { useProjects } from '../context/ProjectContext';

export default function Home() {
  const { projects } = useProjects();
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80" 
            alt="Luxury Real Estate" 
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <span className="text-accent font-medium tracking-wider uppercase text-sm mb-4 block">Welcome to Grazia Inspired</span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Redefining <span className="text-accent italic">Premium</span> Living
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Discover exceptional properties, unparalleled architecture, and investments that secure your future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/projects" className="btn-primary flex items-center justify-center gap-2">
              Explore Projects <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-primary flex items-center justify-center">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-padding bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Premier Projects</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Explore our curated selection of luxury developments designed for modern living.</p>
          </div>
          
          {/* Continuous Marquee Container */}
          <div className="relative overflow-hidden -mx-4 px-4 lg:mx-0 lg:px-0 pb-8">
            <div className="flex w-[max-content] animate-marquee gap-6">
              {/* Render the projects list twice for seamless infinite scrolling */}
              {[...projects, ...projects].map((project, index) => (
                <div 
                  key={`${project.id}-${index}`}
                  className="w-[85vw] sm:w-[400px] shrink-0"
                >
                  <ProjectCard {...project} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Athiya?</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                With years of expertise in land development and real estate, we bring you properties that are legally sound, strategically located, and designed for high appreciation.
              </p>
              <ul className="space-y-4">
                {['100% Clear Titles & Transparency', 'Strategic High-Growth Locations', 'End-to-End Project Management', 'Sustainable Development Practices'].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to="/about" className="text-primary font-bold hover:text-accent flex items-center gap-2 transition-colors">
                  Learn more about us <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <img 
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80" 
                alt="Modern Architecture" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-white p-6 rounded-xl shadow-xl hidden md:block">
                <div className="text-4xl font-bold text-accent mb-1">10+</div>
                <div className="text-sm">Years of Trust</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
