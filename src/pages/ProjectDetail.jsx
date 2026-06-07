import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

export default function ProjectDetail() {
  const { projects } = useProjects();
  const { id } = useParams();
  const project = projects.find(p => p.id === id);
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!project) {
    return (
      <div className="pt-32 pb-20 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <p className="text-slate-600 mb-8">The project you are looking for does not exist.</p>
        <Link to="/projects" className="btn-primary">Back to Projects</Link>
      </div>
    );
  }

  const gallery = (project.gallery || []).filter(Boolean);

  return (
    <div className="pt-20">
      {/* Hero Header */}
      <div className="relative h-[60vh] w-full bg-primary">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="max-w-7xl mx-auto flex flex-col items-start gap-4">
            <div className="bg-accent text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide">
              {project.status}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white">{project.title}</h1>
            <div className="flex items-center gap-2 text-slate-200 text-lg">
              <MapPin className="h-5 w-5 text-accent" />
              <span>{project.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <section className="section-padding bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/projects" className="inline-flex items-center gap-2 text-primary font-medium hover:text-accent transition-colors mb-8">
            <ArrowLeft className="h-5 w-5" /> Back to all projects
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
                <h2 className="text-3xl font-bold mb-6">About the Project</h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-6 text-justify">
                  {project.longDescription}
                </p>
              </div>

              {gallery.length > 0 && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="text-2xl font-bold mb-6">Gallery</h3>
                  <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-slate-100 group">
                    <img
                      src={gallery[currentSlide]}
                      alt={`${project.title} - image ${currentSlide + 1}`}
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />

                    {gallery.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentSlide((currentSlide - 1 + gallery.length) % gallery.length)}
                          aria-label="Previous image"
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-primary shadow hover:bg-white transition-colors"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setCurrentSlide((currentSlide + 1) % gallery.length)}
                          aria-label="Next image"
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-primary shadow hover:bg-white transition-colors"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>

                        {/* Dots */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                          {gallery.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentSlide(index)}
                              aria-label={`Go to image ${index + 1}`}
                              className={`h-2 rounded-full transition-all ${index === currentSlide ? 'w-6 bg-accent' : 'w-2 bg-white/70'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {gallery.length > 1 && (
                    <div className="grid grid-cols-4 gap-3 mt-4">
                      {gallery.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`aspect-video overflow-hidden rounded-lg border-2 transition-all ${index === currentSlide ? 'border-accent' : 'border-transparent opacity-70 hover:opacity-100'}`}
                        >
                          <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-primary text-white p-8 rounded-2xl shadow-xl sticky top-28">
                <h3 className="text-2xl font-bold mb-4 font-serif">Interested in this property?</h3>
                <p className="text-slate-300 mb-8">
                  Get in touch with our experts to learn more about pricing, availability, and scheduling a site visit.
                </p>
                <Link 
                  to="/contact" 
                  state={{ projectTitle: project.title }}
                  className="w-full btn-primary block text-center bg-accent text-white hover:bg-white hover:text-primary border-transparent transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
