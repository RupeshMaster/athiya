import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProjectCard({ id, title, location, image, description, status }) {
  return (
    <div className="group rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary">
          {status}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
          <MapPin className="h-4 w-4 text-accent" />
          <span>{location}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">{title}</h3>
        <p className="text-slate-600 text-sm line-clamp-2 mb-4">{description}</p>
        <Link to={`/projects/${id}`} className="inline-flex items-center gap-2 text-accent font-medium hover:text-accent-hover transition-colors">
          View Details <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
