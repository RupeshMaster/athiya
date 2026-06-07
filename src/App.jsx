import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import { ProjectProvider } from './context/ProjectContext';
import { useAuth } from './context/AuthContext';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Only smooth scroll if we are not already at the top
    if (window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname]);

  return null;
}

// Hide the marketing footer on the admin console (it has its own footer)
function ConditionalFooter() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) {
    return null;
  }
  return <Footer />;
}

// Hide the marketing navbar on the admin console (it has its own top bar)
function ConditionalNavbar() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) {
    return null;
  }
  return <Navbar />;
}

// Route guard for Admin access
function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="h-12 w-12 border-4 border-t-accent border-primary rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  useEffect(() => {
    document.title = "Grazia";
  }, []);

  return (
    <ProjectProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <ConditionalNavbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
            </Routes>
          </main>
          <ConditionalFooter />
        </div>
      </Router>
    </ProjectProvider>
  );
}

export default App;
