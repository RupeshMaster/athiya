import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, ChevronDown, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';

export default function Contact() {
  const { projects } = useProjects();
  const location = useLocation();
  const { user } = useAuth();
  const [enquiryFor, setEnquiryFor] = useState('General Enquiry');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    if (location.state?.projectTitle) {
      setEnquiryFor(location.state.projectTitle);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          ...formData,
          project: enquiryFor
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit enquiry');
      }

      setSubmitSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
      });
      
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
      <div className="bg-primary py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-accent font-medium">Get in Touch with Our Experts</p>
      </div>

      <section className="section-padding bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Let's discuss your next investment.</h2>
              <p className="text-slate-600 mb-10 leading-relaxed">
                Whether you're looking to buy a plot, seeking investment advice, or interested in our premium developments, our team is here to assist you every step of the way.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Office Location</h4>
                    <p className="text-slate-600">110/B, Mahadev Patil CHS, Ghatla Village<br/>Chembur, Mumbai, Maharashtra</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                    <Phone className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Phone Number</h4>
                    <p className="text-slate-600">+91 9920081867</p>
                    {/* <p className="text-slate-600">+91 91527 31199</p> */}
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                    <Mail className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Email Address</h4>
                    <p className="text-slate-600">info@athiyadevelopers.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 relative">
              <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
              
              {!user && (
                <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center rounded-2xl">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
                    <Lock className="h-8 w-8 text-accent" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-2 font-serif">Sign in Required</h4>
                  <p className="text-slate-700 font-medium mb-6 max-w-sm">
                    Please log in or create an account to send a message to our experts.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link to="/login" state={{ from: '/contact' }} className="btn-primary w-full sm:w-auto">
                      Log In
                    </Link>
                    <Link to="/signup" className="px-6 py-3 rounded-lg font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors w-full sm:w-auto">
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}

              {submitSuccess && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <p className="text-sm text-green-700 font-medium">Thank you! Your message has been sent successfully.</p>
                </div>
              )}

              {submitError && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              )}

              <form className={`space-y-6 ${!user ? 'opacity-30 pointer-events-none select-none' : ''}`} onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors" placeholder="Doe" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors" placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">I Want To Enquire For</label>
                  <div className="relative">
                    <select 
                      value={enquiryFor}
                      onChange={(e) => setEnquiryFor(e.target.value)}
                      className="w-full px-4 pr-10 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors bg-white appearance-none cursor-pointer"
                    >
                      <option value="General Enquiry">General Enquiry</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.title}>{project.title}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea rows="4" name="message" value={formData.message} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors" placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full btn-primary flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-4 w-4" /> Send Message</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
