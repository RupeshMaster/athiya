import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import Logo from '../assets/Images/Favicon.png'

export default function Footer() {
  return (
    <footer className="bg-primary text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src={Logo} alt="Grazia logo" className="h-8 w-8 object-contain" />
              <span className="font-serif font-bold text-2xl text-white">Grazia</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Redefining premium real estate and land development with trust, transparency, and architectural excellence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-accent transition-colors text-sm font-medium">Instagram</a>
              <a href="#" className="text-slate-400 hover:text-accent transition-colors text-sm font-medium">LinkedIn</a>
              <a href="#" className="text-slate-400 hover:text-accent transition-colors text-sm font-medium">Twitter</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-white font-serif font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/projects" className="hover:text-accent transition-colors">Our Projects</Link></li>
              <li><Link to="/services" className="hover:text-accent transition-colors">Services</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Projects */}
          <div className="col-span-1">
            <h4 className="text-white font-serif font-semibold text-lg mb-4">Featured Projects</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/projects/farm-dale" className="hover:text-accent transition-colors">The Farm Dale</Link></li>
              <li><Link to="/projects/dapoli-712" className="hover:text-accent transition-colors">Dapoli 712</Link></li>
              <li><Link to="/projects/maha-mumbai-hub" className="hover:text-accent transition-colors">Maha Mumbai</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-white font-serif font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span>10/B, Mahadev Patil CHS, Ghatla Village Chembur, Mumbai, Maharashtra</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <span>+91 9920081867</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <span>info@athiyadevelopers.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} Grazia Developers Inspired. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
