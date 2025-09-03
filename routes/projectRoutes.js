const express = require('express');
const router = express.Router();
const projectControllers = require('../controllers/projectControllers');

// Create Project
router.post('/add', projectControllers.createProject);

// Delete Project
router.delete('/:id', projectControllers.deleteProject);

// Update Project
router.put('/:id', projectControllers.updateProject);

// Get All Projects
router.get('/', projectControllers.getAllProjects);

module.exports = router;
