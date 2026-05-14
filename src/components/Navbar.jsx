import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Services', path: '/services' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-accent" />
            <span className="font-serif font-bold text-2xl text-primary">Athiya<span className="text-accent">.</span></span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-accent ${isActive(link.path) ? 'text-accent' : 'text-slate-600'}`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center space-x-6 border-l border-slate-200 pl-6 ml-2">
              <Link to="/contact" className={`text-sm font-medium transition-colors hover:text-accent ${isActive('/contact') ? 'text-accent' : 'text-slate-600'}`}>
                Contact Us
              </Link>
              {user ? (
                <button onClick={logout} className="btn-primary py-2 px-4 text-sm">
                  Sign Out
                </button>
              ) : (
                <Link to="/signup" className="btn-primary py-2 px-4 text-sm">
                  Sign Up
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary hover:text-accent focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.path) ? 'text-accent bg-slate-50' : 'text-slate-600 hover:text-accent hover:bg-slate-50'}`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/contact') ? 'text-accent bg-slate-50' : 'text-slate-600 hover:text-accent hover:bg-slate-50'}`}
            >
              Contact Us
            </Link>
            <div className="border-t border-slate-100 pt-4 pb-2 px-3 mt-2">
              {user ? (
                <button onClick={() => { logout(); setIsOpen(false); }} className="block w-full text-center btn-primary py-3">
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center btn-primary py-3"
                >
                  Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
