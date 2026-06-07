import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  MessageSquare,
  Folder,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Search,
  Calendar,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  CheckCircle,
  AlertCircle,
  FileText,
  X,
  ArrowRight,
  Menu,
  LogOut,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import Logo from '../assets/Images/Favicon.png';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { projects, loading: projectsLoading, addProject, updateProject, deleteProject } = useProjects();

  const [activeTab, setActiveTab] = useState('overview');
  // Sidebar drawer toggle (open by default on desktop, closed on mobile)
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth >= 768
  );
  const [dashboardData, setDashboardData] = useState({
    metrics: { totalUsers: 0, totalSales: 0, totalEnquiries: 0, totalProjects: 0 },
    sales: [],
    enquiries: [],
    users: []
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  // Search filters
  const [searchQuery, setSearchQuery] = useState('');

  // Project Form Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    id: '',
    title: '',
    location: '',
    image: '',
    description: '',
    status: 'Planning',
    longDescription: '',
    gallery: ['', '', '', '']
  });
  const [projectSubmitLoading, setProjectSubmitLoading] = useState(false);
  const [projectSubmitError, setProjectSubmitError] = useState('');

  // Sale Form Modal State
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [saleForm, setSaleForm] = useState({
    project: '',
    amount: '',
    clientName: '',
    clientEmail: '',
    status: 'Completed',
    date: new Date().toISOString().split('T')[0]
  });
  const [saleSubmitLoading, setSaleSubmitLoading] = useState(false);
  const [saleSubmitError, setSaleSubmitError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  // Fetch admin stats (users, sales, enquiries)
  const fetchDashboardStats = async () => {
    setLoadingStats(true);
    try {
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to load dashboard metrics');
      }
      const data = await response.json();
      setDashboardData(data);
      setStatsError(null);
    } catch (err) {
      console.error(err);
      setStatsError(err.message);
      // Simulating stats for offline demo if fetch fails
      simulateOfflineStats();
    } finally {
      setLoadingStats(false);
    }
  };

  const simulateOfflineStats = () => {
    // Offline simulation
    const mockUsers = [
      { name: 'Admin Developer', email: 'admin@athiya.com', createdAt: new Date().toISOString() },
      { name: 'John Doe', email: 'john@example.com', createdAt: new Date(Date.now() - 24*60*60*1000).toISOString() },
      { name: 'Sarah Connor', email: 'sarah@skynet.com', createdAt: new Date(Date.now() - 3*24*60*60*1000).toISOString() }
    ];
    const mockSales = [
      { project: 'The Farm Dale', amount: 4500000, clientName: 'Rohan Sharma', clientEmail: 'rohan@gmail.com', status: 'Completed', createdAt: new Date().toISOString() },
      { project: 'Third Mumbai (KSC New Town)', amount: 9800000, clientName: 'Pooja Patel', clientEmail: 'pooja@yahoo.com', status: 'Completed', createdAt: new Date(Date.now() - 4*24*60*60*1000).toISOString() }
    ];
    const mockEnquiries = [
      { firstName: 'Amit', lastName: 'Kumar', email: 'amit@gmail.com', phone: '+91 9876543210', project: 'The Farm Dale', message: 'I am interested in buying a 2 BHK villa plots here.', createdAt: new Date().toISOString() },
      { firstName: 'Sanya', lastName: 'Gupta', email: 'sanya@yahoo.com', phone: '+91 8765432109', project: 'General Enquiry', message: 'Looking for investment advice on Navi Mumbai plots.', createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString() }
    ];
    
    setDashboardData({
      metrics: {
        totalUsers: mockUsers.length,
        totalSales: mockSales.reduce((acc, curr) => acc + curr.amount, 0),
        totalEnquiries: mockEnquiries.length,
        totalProjects: projects.length || 8
      },
      sales: mockSales,
      enquiries: mockEnquiries,
      users: mockUsers
    });
  };

  useEffect(() => {
    if (user?.token) {
      fetchDashboardStats();
    }
  }, [user, projects]); // Refetch if projects list updates (which updates totalProjects)

  // Reset Project Form
  const handleOpenProjectModal = (proj = null) => {
    if (proj) {
      setEditingProject(proj);
      setProjectForm({
        id: proj.id,
        title: proj.title,
        location: proj.location,
        image: proj.image,
        description: proj.description,
        status: proj.status || 'Planning',
        longDescription: proj.longDescription || '',
        // Preload existing gallery, padded to 4 slots
        gallery: [...(proj.gallery || []), '', '', '', ''].slice(0, 4)
      });
    } else {
      setEditingProject(null);
      setProjectForm({
        id: '',
        title: '',
        location: '',
        image: '',
        description: '',
        status: 'Planning',
        longDescription: '',
        gallery: ['', '', '', '']
      });
    }
    setProjectSubmitError('');
    setIsProjectModalOpen(true);
  };

  // Convert an uploaded image file into a base64 data URL we can store as a string
  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleMainImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setProjectForm((prev) => ({ ...prev, image: dataUrl }));
  };

  const handleGalleryImageChange = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setProjectForm((prev) => {
      const gallery = [...prev.gallery];
      gallery[index] = dataUrl;
      return { ...prev, gallery };
    });
  };

  const handleProjectFormSubmit = async (e) => {
    e.preventDefault();
    setProjectSubmitLoading(true);
    setProjectSubmitError('');

    const formattedData = {
      ...projectForm,
      // Only keep slider slots that actually have an image
      gallery: projectForm.gallery.filter(Boolean)
    };

    try {
      if (editingProject) {
        await updateProject(editingProject.id || editingProject._id, formattedData, user.token);
      } else {
        await addProject(formattedData, user.token);
      }
      setIsProjectModalOpen(false);
      fetchDashboardStats();
    } catch (err) {
      setProjectSubmitError(err.message || 'Error processing request');
    } finally {
      setProjectSubmitLoading(false);
    }
  };

  const handleProjectDelete = async (projId) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteProject(projId, user.token);
        fetchDashboardStats();
      } catch (err) {
        alert(err.message || 'Error deleting project');
      }
    }
  };

  // Handle Log Sale Submission
  const handleOpenSaleModal = () => {
    setSaleForm({
      project: projects.length > 0 ? projects[0].title : '',
      amount: '',
      clientName: '',
      clientEmail: '',
      status: 'Completed',
      date: new Date().toISOString().split('T')[0]
    });
    setSaleSubmitError('');
    setIsSaleModalOpen(true);
  };

  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    setSaleSubmitLoading(true);
    setSaleSubmitError('');

    try {
      const response = await fetch(`${API_URL}/admin/sales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          ...saleForm,
          amount: Number(saleForm.amount)
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to log sale');
      }

      setIsSaleModalOpen(false);
      fetchDashboardStats();
    } catch (err) {
      setSaleSubmitError(err.message || 'Error logging sale');
    } finally {
      setSaleSubmitLoading(false);
    }
  };

  // Currency Formatter
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Search Filtering
  const filteredSales = dashboardData.sales.filter(sale => 
    sale.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.clientEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEnquiries = dashboardData.enquiries.filter(enq => 
    enq.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enq.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enq.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (enq.message && enq.message.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredUsers = dashboardData.users.filter(usr => 
    usr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    usr.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navItemClass = (tab) =>
    `w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${activeTab === tab ? 'bg-accent text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`;

  // Select a tab and auto-close the drawer on mobile
  const selectTab = (tab) => {
    setActiveTab(tab);
    setSearchQuery('');
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Top bar: hamburger (left) + centered logo */}
      <header className="fixed top-0 inset-x-0 h-20 z-50 bg-white/90 backdrop-blur-md shadow-sm flex items-center px-4 sm:px-6">
        <button
          onClick={() => setSidebarOpen((open) => !open)}
          aria-label="Toggle sidebar"
          className="p-2 rounded-lg text-primary hover:bg-slate-100 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <img src={Logo} alt="Grazia logo" className="h-7 w-7 sm:h-8 sm:w-8 object-contain" />
          <span className="font-serif font-bold text-xl sm:text-2xl text-primary">Grazia</span>
        </Link>
        <Link
          to="/"
          className="ml-auto flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium text-primary hover:bg-slate-100 transition-colors"
        >
          <Home className="h-5 w-5" />
          <span className="hidden sm:inline">Home</span>
        </Link>
      </header>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 top-20 bg-slate-900/50 z-30 md:hidden"
        />
      )}

      {/* Sidebar drawer */}
      <aside
        className={`fixed top-20 left-0 bottom-0 w-64 bg-primary text-white z-40 flex flex-col border-r border-slate-800 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 border-b border-slate-800">
          <h2 className="font-serif font-bold text-xl text-accent">Admin Console</h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">Logged in as {user?.name}</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <button onClick={() => selectTab('overview')} className={navItemClass('overview')}>
            <TrendingUp className="h-4 w-4 shrink-0" /> Overview Dashboard
          </button>
          <button onClick={() => selectTab('projects')} className={navItemClass('projects')}>
            <Folder className="h-4 w-4 shrink-0" /> Manage Projects
          </button>
          <button onClick={() => selectTab('sales')} className={navItemClass('sales')}>
            <DollarSign className="h-4 w-4 shrink-0" /> Sales Ledger
          </button>
          <button onClick={() => selectTab('enquiries')} className={navItemClass('enquiries')}>
            <MessageSquare className="h-4 w-4 shrink-0" /> User Enquiries ({dashboardData.metrics.totalEnquiries})
          </button>
          <button onClick={() => selectTab('users')} className={navItemClass('users')}>
            <Users className="h-4 w-4 shrink-0" /> Users Directory
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 text-slate-300 hover:bg-red-600 hover:text-white"
          >
            <LogOut className="h-4 w-4 shrink-0" /> Logout
          </button>
        </div>
      </aside>

      {/* Content + footer wrapper (shifts right when sidebar is open on desktop) */}
      <div className={`pt-20 flex flex-col flex-1 min-h-screen transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>

        {/* Main content container */}
        <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full">
        {loadingStats && activeTab === 'overview' ? (
          <div className="h-[60vh] flex flex-col justify-center items-center gap-4">
            <Loader2 className="h-10 w-10 text-accent animate-spin" />
            <p className="text-slate-500 font-medium">Retrieving Admin Data...</p>
          </div>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-primary">
                  {activeTab === 'overview' && 'System Overview'}
                  {activeTab === 'projects' && 'Projects Catalog'}
                  {activeTab === 'sales' && 'Sales ledger'}
                  {activeTab === 'enquiries' && 'User Enquiries'}
                  {activeTab === 'users' && 'Users Directory'}
                </h1>
                <p className="text-slate-500 mt-1">
                  {activeTab === 'overview' && 'Track core business statistics and recent activity.'}
                  {activeTab === 'projects' && 'Publish, modify, and delete developer real estate project listings.'}
                  {activeTab === 'sales' && 'Log client sales and inspect transaction history.'}
                  {activeTab === 'enquiries' && 'Browse message details and inquiries from interested buyers.'}
                  {activeTab === 'users' && 'Manage and inspect registered application users.'}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-3">
                {activeTab === 'projects' && (
                  <button 
                    onClick={() => handleOpenProjectModal()} 
                    className="btn-primary py-2.5 px-4 text-sm flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add Project
                  </button>
                )}
                {activeTab === 'sales' && (
                  <button 
                    onClick={handleOpenSaleModal} 
                    className="btn-primary py-2.5 px-4 text-sm flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Log Sale
                  </button>
                )}
              </div>
            </div>

            {/* TAB CONTENT: OVERVIEW */}
            {activeTab === 'overview' && (
              <>
                {/* Stats grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1 */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
                    <div className="p-4 bg-blue-50 rounded-xl text-blue-600">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-500 block">Total Users</span>
                      <span className="text-2xl font-bold text-slate-900">{dashboardData.metrics.totalUsers}</span>
                    </div>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
                    <div className="p-4 bg-emerald-50 rounded-xl text-emerald-600">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-500 block">Total Sales Value</span>
                      <span className="text-2xl font-bold text-slate-900">{formatCurrency(dashboardData.metrics.totalSales)}</span>
                    </div>
                  </div>
                  {/* Card 3 */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
                    <div className="p-4 bg-amber-50 rounded-xl text-amber-600">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-500 block">Total Enquiries</span>
                      <span className="text-2xl font-bold text-slate-900">{dashboardData.metrics.totalEnquiries}</span>
                    </div>
                  </div>
                  {/* Card 4 */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
                    <div className="p-4 bg-purple-50 rounded-xl text-purple-600">
                      <Folder className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-500 block">Active Projects</span>
                      <span className="text-2xl font-bold text-slate-900">{dashboardData.metrics.totalProjects}</span>
                    </div>
                  </div>
                </div>

                {/* Sub-tables layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Enquiries */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold font-serif text-primary">Recent Enquiries</h3>
                      <button onClick={() => setActiveTab('enquiries')} className="text-sm font-semibold text-accent hover:text-accent-hover flex items-center gap-1">
                        View All <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {dashboardData.enquiries.length === 0 ? (
                      <p className="text-slate-500 text-sm py-4">No enquiries submitted yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {dashboardData.enquiries.slice(0, 3).map((enq, index) => (
                          <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <span className="font-bold text-slate-800 text-sm">{enq.firstName} {enq.lastName}</span>
                              <span className="text-xs text-accent font-semibold px-2 py-0.5 bg-amber-50 rounded-md">{enq.project}</span>
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-2 italic mb-2">"{enq.message}"</p>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {new Date(enq.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Sales */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold font-serif text-primary">Recent Bookings / Sales</h3>
                      <button onClick={() => setActiveTab('sales')} className="text-sm font-semibold text-accent hover:text-accent-hover flex items-center gap-1">
                        View Ledger <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>

                    {dashboardData.sales.length === 0 ? (
                      <p className="text-slate-500 text-sm py-4">No sales logged yet.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-400 font-medium text-xs">
                              <th className="pb-3">Client</th>
                              <th className="pb-3">Project</th>
                              <th className="pb-3 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dashboardData.sales.slice(0, 3).map((sale, index) => (
                              <tr key={index} className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50">
                                <td className="py-3 font-semibold text-slate-800">{sale.clientName}</td>
                                <td className="py-3">{sale.project}</td>
                                <td className="py-3 text-right text-emerald-600 font-bold">{formatCurrency(sale.amount)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* TAB CONTENT: MANAGE PROJECTS */}
            {activeTab === 'projects' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {projectsLoading ? (
                  <div className="p-12 text-center text-slate-500">Loading catalog...</div>
                ) : projects.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">No project listings found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr className="text-slate-500 font-semibold text-xs">
                          <th className="p-4">Project Info</th>
                          <th className="p-4">Location</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {projects.map((proj) => (
                          <tr key={proj.id || proj._id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={proj.image} 
                                  alt={proj.title} 
                                  className="w-12 h-12 object-cover rounded-lg border border-slate-200" 
                                />
                                <div>
                                  <span className="font-bold text-slate-800 block text-base">{proj.title}</span>
                                  <span className="text-xs text-slate-400 block max-w-sm truncate">{proj.description}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                {proj.location}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                                proj.status === 'Completed' ? 'bg-green-50 text-green-700' :
                                proj.status === 'Ongoing' ? 'bg-blue-50 text-blue-700' :
                                proj.status === 'Pre-Launch' ? 'bg-amber-50 text-amber-700' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {proj.status}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => handleOpenProjectModal(proj)} 
                                  className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-accent rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleProjectDelete(proj.id || proj._id)} 
                                  className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-red-600 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: SALES LEDGER */}
            {activeTab === 'sales' && (
              <div className="space-y-6">
                {/* Search and filters bar */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-150 shadow-sm">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search sales..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                    />
                  </div>
                  <div className="text-sm font-semibold text-slate-500 flex-shrink-0">
                    Total Transactions: {filteredSales.length}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  {filteredSales.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">No sale records match your criteria.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr className="text-slate-500 font-semibold text-xs">
                            <th className="p-4">Date</th>
                            <th className="p-4">Project</th>
                            <th className="p-4">Client Name</th>
                            <th className="p-4">Client Email</th>
                            <th className="p-4 text-right">Deal Amount</th>
                            <th className="p-4 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredSales.map((sale, index) => (
                            <tr key={index} className="hover:bg-slate-50 transition-colors">
                              <td className="p-4 text-slate-500 font-medium">
                                {new Date(sale.date || sale.createdAt).toLocaleDateString()}
                              </td>
                              <td className="p-4 font-bold text-slate-800">{sale.project}</td>
                              <td className="p-4 font-medium text-slate-700">{sale.clientName}</td>
                              <td className="p-4 text-slate-500">{sale.clientEmail}</td>
                              <td className="p-4 text-right text-emerald-600 font-bold text-base">
                                {formatCurrency(sale.amount)}
                              </td>
                              <td className="p-4 text-center">
                                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                                  sale.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                  sale.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                  'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                  {sale.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: ENQUIRIES */}
            {activeTab === 'enquiries' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-150 shadow-sm">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search enquiries..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                    />
                  </div>
                  <div className="text-sm font-semibold text-slate-500">
                    Total Enquiries: {filteredEnquiries.length}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredEnquiries.length === 0 ? (
                    <div className="col-span-2 p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-100">
                      No enquiries matched your search parameters.
                    </div>
                  ) : (
                    filteredEnquiries.map((enq, index) => (
                      <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start gap-4 mb-4">
                          <div>
                            <h3 className="font-serif font-bold text-lg text-primary">{enq.firstName} {enq.lastName}</h3>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                              <Calendar className="h-3 w-3" /> {new Date(enq.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <span className="px-3 py-1 bg-amber-50 text-accent text-xs font-bold rounded-full border border-amber-100">
                            {enq.project}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4 border-t border-b border-slate-50 py-3">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                            <a href={`mailto:${enq.email}`} className="hover:text-accent font-medium">{enq.email}</a>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                            <a href={`tel:${enq.phone}`} className="hover:text-accent font-medium">{enq.phone}</a>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Message</span>
                          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line italic">"{enq.message}"</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: USERS DIRECTORY */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-150 shadow-sm">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                    />
                  </div>
                  <div className="text-sm font-semibold text-slate-500">
                    Total Registered: {filteredUsers.length}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  {filteredUsers.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">No user accounts found.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr className="text-slate-500 font-semibold text-xs">
                            <th className="p-4">Full Name</th>
                            <th className="p-4">Email Address</th>
                            <th className="p-4">Date Joined</th>
                            <th className="p-4 text-center">Status / Roles</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredUsers.map((usr, index) => (
                            <tr key={index} className="hover:bg-slate-50 transition-colors">
                              <td className="p-4 font-bold text-slate-800">{usr.name}</td>
                              <td className="p-4 text-slate-600">{usr.email}</td>
                              <td className="p-4 text-slate-500">
                                {new Date(usr.createdAt).toLocaleDateString()}
                              </td>
                              <td className="p-4 text-center">
                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  usr.isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {usr.isAdmin ? 'Administrator' : 'Standard User'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}
        </main>

        {/* Admin footer */}
        <footer className="bg-primary text-slate-400 border-t border-slate-800 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Grazia Developers — Admin Console. All rights reserved.</p>
          <p className="text-slate-500">Internal management portal · Authorized access only</p>
        </footer>
      </div>

      {/* MODAL: ADD / EDIT PROJECT */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-zoomIn my-8">
            <div className="bg-primary text-white p-6 flex justify-between items-center border-b border-slate-800">
              <h3 className="font-serif font-bold text-xl text-accent">
                {editingProject ? 'Modify Project' : 'Add New Project'}
              </h3>
              <button 
                onClick={() => setIsProjectModalOpen(false)} 
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {projectSubmitError && (
              <div className="m-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-700">{projectSubmitError}</p>
              </div>
            )}

            <form onSubmit={handleProjectFormSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Slug / ID</label>
                  <input 
                    type="text" 
                    placeholder="e.g. karjat-retreat"
                    value={projectForm.id}
                    onChange={(e) => setProjectForm({ ...projectForm, id: e.target.value })}
                    required
                    disabled={!!editingProject}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent disabled:bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Karjat Retreat"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Karjat, Maharashtra"
                    value={projectForm.location}
                    onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current Project Status</label>
                  <select 
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent bg-white"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Pre-Launch">Pre-Launch</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Main Project Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  required={!projectForm.image}
                  className="w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent-hover file:cursor-pointer border border-slate-200 rounded-lg"
                />
                {projectForm.image && (
                  <img
                    src={projectForm.image}
                    alt="Main preview"
                    className="mt-3 h-28 w-full object-cover rounded-lg border border-slate-200"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Short Summary / Description</label>
                <textarea 
                  rows="2"
                  placeholder="Provide a brief summary for project listings..."
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Detailed Description</label>
                <textarea 
                  rows="4"
                  placeholder="Provide comprehensive details about the property, ROI potential, and surrounding layout..."
                  value={projectForm.longDescription}
                  onChange={(e) => setProjectForm({ ...projectForm, longDescription: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gallery Images (shown as a slider on the project page)</label>
                <p className="text-xs text-slate-400 mb-3">Upload up to 4 images for the project detail slideshow.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-3">
                      <span className="block text-xs font-semibold text-slate-500 mb-2">Slide {index + 1}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleGalleryImageChange(e, index)}
                        className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 file:cursor-pointer"
                      />
                      {projectForm.gallery[index] && (
                        <img
                          src={projectForm.gallery[index]}
                          alt={`Slide ${index + 1} preview`}
                          className="mt-2 h-24 w-full object-cover rounded-md border border-slate-200"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button 
                  type="button" 
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={projectSubmitLoading}
                  className="px-5 py-2.5 text-sm font-medium rounded-lg bg-accent hover:bg-accent-hover text-white flex items-center gap-2 transition-all hover:scale-105"
                >
                  {projectSubmitLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG SALE TRANSACTION */}
      {isSaleModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-zoomIn">
            <div className="bg-primary text-white p-6 flex justify-between items-center border-b border-slate-800">
              <h3 className="font-serif font-bold text-xl text-accent">Record Sale Deal</h3>
              <button 
                onClick={() => setIsSaleModalOpen(false)} 
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {saleSubmitError && (
              <div className="m-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-700">{saleSubmitError}</p>
              </div>
            )}

            <form onSubmit={handleSaleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Selected</label>
                <select 
                  value={saleForm.project}
                  onChange={(e) => setSaleForm({ ...saleForm, project: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent bg-white"
                >
                  {projects.map((proj) => (
                    <option key={proj.id || proj._id} value={proj.title}>{proj.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Transaction Amount (INR)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 5000000"
                  value={saleForm.amount}
                  onChange={(e) => setSaleForm({ ...saleForm, amount: e.target.value })}
                  required
                  min="0"
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Client Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ramesh Patel"
                  value={saleForm.clientName}
                  onChange={(e) => setSaleForm({ ...saleForm, clientName: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Client Email Address</label>
                <input 
                  type="email" 
                  placeholder="e.g. ramesh@patel.com"
                  value={saleForm.clientEmail}
                  onChange={(e) => setSaleForm({ ...saleForm, clientEmail: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deal Status</label>
                  <select 
                    value={saleForm.status}
                    onChange={(e) => setSaleForm({ ...saleForm, status: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent bg-white"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sale Date</label>
                  <input 
                    type="date" 
                    value={saleForm.date}
                    onChange={(e) => setSaleForm({ ...saleForm, date: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsSaleModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saleSubmitLoading}
                  className="px-5 py-2.5 text-sm font-medium rounded-lg bg-accent hover:bg-accent-hover text-white flex items-center gap-2 transition-all hover:scale-105"
                >
                  {saleSubmitLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Log Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
