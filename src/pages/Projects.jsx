import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/projects';

export default function Projects() {
  return (
    <div className="pt-20">
      <div className="bg-primary py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Projects</h1>
        <p className="text-accent font-medium">Discover Your Next Investment</p>
      </div>

      <section className="section-padding bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
