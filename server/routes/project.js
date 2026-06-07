const express = require('express');
const Project = require('../models/Project');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project by slug/id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({ id: req.params.id });
    if (project) {
      res.json(project);
    } else {
      // Fallback to _id
      const projectById = await Project.findById(req.params.id);
      if (projectById) {
        res.json(projectById);
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { id, title, location, image, description, status, longDescription, features, gallery } = req.body;

  try {
    const projectExists = await Project.findOne({ id });
    if (projectExists) {
      return res.status(400).json({ message: 'Project with this ID/slug already exists' });
    }

    const project = await Project.create({
      id,
      title,
      location,
      image,
      description,
      status,
      longDescription,
      features,
      gallery
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  const { title, location, image, description, status, longDescription, features, gallery } = req.body;

  try {
    let project = await Project.findOne({ id: req.params.id });
    if (!project) {
      project = await Project.findById(req.params.id);
    }

    if (project) {
      project.title = title || project.title;
      project.location = location || project.location;
      project.image = image || project.image;
      project.description = description || project.description;
      project.status = status || project.status;
      project.longDescription = longDescription || project.longDescription;
      project.features = features || project.features;
      project.gallery = gallery !== undefined ? gallery : project.gallery;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    let project = await Project.findOne({ id: req.params.id });
    if (!project) {
      project = await Project.findById(req.params.id);
    }

    if (project) {
      await project.deleteOne();
      res.json({ message: 'Project removed successfully' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
