// const connection = require('../config/db');

// const addExecutive = async (req, res) => {
//   try {
//     const { full_name, mobile, email, designation } = req.body;

//     if (!full_name || !mobile || !email || !designation) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     const mobileRegex = /^[0-9]{10}$/;
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!mobileRegex.test(mobile)) {
//       return res.status(400).json({ message: 'Mobile must be 10 digits' });
//     }

//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ message: 'Invalid email address' });
//     }

//     // Check for duplicate
//     const [exists] = await connection.promise().query(
//       'SELECT * FROM executives WHERE email = ? OR mobile = ?',
//       [email, mobile]
//     );

//     if (exists.length > 0) {
//       return res.status(400).json({ message: 'Email or mobile already exists' });
//     }

//     await connection.promise().query(
//       'INSERT INTO executives (full_name, mobile, email, designation) VALUES (?, ?, ?, ?)',
//       [full_name, mobile, email, designation]
//     );

//     res.status(201).json({ message: 'Executive added successfully' });

//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// const getAllExecutives = async (req, res) => {
//   try {
//     const [rows] = await connection.promise().query(
//       'SELECT * FROM executives ORDER BY id DESC'
//     );

//     res.status(200).json({ executives: rows });

//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// const updateExecutive = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { full_name, mobile, email, designation } = req.body;

//     if (!full_name || !mobile || !email || !designation) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     await connection.promise().query(
//       'UPDATE executives SET full_name = ?, mobile = ?, email = ?, designation = ? WHERE id = ?',
//       [full_name, mobile, email, designation, id]
//     );

//     res.status(200).json({ message: 'Executive updated successfully' });

//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// const deleteExecutive = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await connection.promise().query('DELETE FROM executives WHERE id = ?', [id]);

//     res.status(200).json({ message: 'Executive deleted successfully' });

//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// module.exports = {
//   addExecutive,
//   getAllExecutives,
//   updateExecutive,
//   deleteExecutive
// };


const Executive = require('../models/Executive');

// ➕ Add Executive
const addExecutive = async (req, res) => {
  try {
    const { full_name, mobile, email, designation } = req.body;

    // Validate required fields
    if (!full_name || !mobile || !email || !designation) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate formats
    const mobileRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({ message: 'Mobile must be 10 digits' });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Check for duplicates
    const existing = await Executive.findByEmailOrMobile(email, mobile);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email or mobile already exists' });
    }

    await Executive.create({ full_name, mobile, email, designation });

    res.status(201).json({ message: 'Executive added successfully' });

  } catch (err) {
    console.error('Add Executive Error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 📋 Get All Executives
const getAllExecutives = async (req, res) => {
  try {
    const executives = await Executive.getAll();
    res.status(200).json({ executives });
  } catch (err) {
    console.error('Get All Executives Error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✏️ Update Executive
const updateExecutive = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, mobile, email, designation } = req.body;

    if (!full_name || !mobile || !email || !designation) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    await Executive.update(id, { full_name, mobile, email, designation });

    res.status(200).json({ message: 'Executive updated successfully' });

  } catch (err) {
    console.error('Update Executive Error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 🗑️ Delete Executive
const deleteExecutive = async (req, res) => {
  try {
    const { id } = req.params;
    await Executive.delete(id);
    res.status(200).json({ message: 'Executive deleted successfully' });
  } catch (err) {
    console.error('Delete Executive Error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  addExecutive,
  getAllExecutives,
  updateExecutive,
  deleteExecutive
};
