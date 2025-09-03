// const db = require('../config/db');
// const { addProject } = require('../models/projectModel');

// // ➕ Create New Project
// const createProject = async (req, res) => {
//   const { name, address, type } = req.body;

//   if (!name || !address || !type) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   if (!['Residential', 'Commercial'].includes(type)) {
//     return res.status(400).json({ error: 'Invalid project type' });
//   }

//   try {
//     await addProject(name, address, type);
//     res.status(201).json({ message: 'Project added successfully' });
//   } catch (err) {
//     console.error('Error adding project:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // 🗑️ Delete Project
// const deleteProject = (req, res) => {
//   const { id } = req.params;

//   const sql = 'DELETE FROM projects WHERE id = ?';
//   db.query(sql, [id], (err, result) => {
//     if (err) return res.status(500).json({ error: 'Database error', err });

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'Project not found' });
//     }

//     res.status(200).json({ message: 'Project deleted successfully' });
//   });
// };

// // ✏️ Update Project
// const updateProject = (req, res) => {
//   const { id } = req.params;
//   const { name, address, type } = req.body;

//   if (!name || !address || !type) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   const sql = 'UPDATE projects SET name = ?, address = ?, type = ? WHERE id = ?';
//   db.query(sql, [name, address, type, id], (err, result) => {
//     if (err) return res.status(500).json({ error: 'Database error', err });

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'Project not found' });
//     }

//     res.status(200).json({ message: 'Project updated successfully' });
//   });
// };

// // 📋 Get All Projects
// const getAllProjects = (req, res) => {
//   const sql = 'SELECT * FROM projects';
//   db.query(sql, (err, results) => {
//     if (err) return res.status(500).json({ error: 'Database error', err });

//     res.status(200).json(results);
//   });
// };

// // ✅ Final Export (all in one object)
// module.exports = {
//   createProject,
//   deleteProject,
//   updateProject,
//   getAllProjects,
// };



const db = require('../config/db');
const { addProject } = require('../models/projectModel');

// ➕ Create New Project
const createProject = async (req, res) => {
  const { name, address, type } = req.body;

  if (!name || !address || !type) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!['Residential', 'Commercial'].includes(type)) {
    return res.status(400).json({ error: 'Invalid project type' });
  }

  try {
    await addProject(name, address, type);
    res.status(201).json({ message: 'Project added successfully' });
  } catch (err) {
    console.error('Error adding project:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// 🗑️ Delete Project
const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM projects WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✏️ Update Project
const updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, address, type } = req.body;

  if (!name || !address || !type) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!['Residential', 'Commercial'].includes(type)) {
    return res.status(400).json({ error: 'Invalid project type' });
  }

  try {
    const [result] = await db.query(
      'UPDATE projects SET name = ?, address = ?, type = ? WHERE id = ?',
      [name, address, type, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json({ message: 'Project updated successfully' });
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// 📋 Get All Projects
const getAllProjects = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM projects ORDER BY id DESC');
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Export all controllers
module.exports = {
  createProject,
  deleteProject,
  updateProject,
  getAllProjects,
};

