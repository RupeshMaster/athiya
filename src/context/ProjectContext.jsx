import { createContext, useContext, useState, useEffect } from 'react';
import { projects as staticProjects } from '../data/projects';

const ProjectContext = createContext();

export function useProjects() {
  return useContext(ProjectContext);
}

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/projects`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects from server');
      }
      const data = await response.json();
      setProjects(data);
      setError(null);
    } catch (err) {
      console.warn('Backend fetch failed, falling back to static projects list. Error:', err.message);
      // Fallback to static projects in case server is not running
      setProjects(staticProjects);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async (projectData, token) => {
    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add project');
      }

      // Refresh project list from server
      await fetchProjects();
      return data;
    } catch (err) {
      // For fallback/offline testing: if the server fails, simulate it locally
      if (error) {
        const simulated = { ...projectData, createdAt: new Date().toISOString() };
        setProjects(prev => [simulated, ...prev]);
        return simulated;
      }
      throw err;
    }
  };

  const updateProject = async (projectId, projectData, token) => {
    try {
      const response = await fetch(`${API_URL}/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update project');
      }

      await fetchProjects();
      return data;
    } catch (err) {
      if (error) {
        setProjects(prev => prev.map(p => (p.id === projectId || p._id === projectId ? { ...p, ...projectData } : p)));
        return { id: projectId, ...projectData };
      }
      throw err;
    }
  };

  const deleteProject = async (projectId, token) => {
    try {
      const response = await fetch(`${API_URL}/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete project');
      }

      await fetchProjects();
      return data;
    } catch (err) {
      if (error) {
        setProjects(prev => prev.filter(p => p.id !== projectId && p._id !== projectId));
        return { success: true };
      }
      throw err;
    }
  };

  const value = {
    projects,
    loading,
    error,
    refreshProjects: fetchProjects,
    addProject,
    updateProject,
    deleteProject
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}
