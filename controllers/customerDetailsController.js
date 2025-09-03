const db = require('../config/db');

// Add customer details (project interaction)
exports.addCustomerDetails = (req, res) => {
  const {
    customer_id,
    first_name,
    middle_name,
    last_name,
    project_id,
    executive_id,
    interaction_type,
    date,
    unit_no,
    contact_number,
    remark
  } = req.body;

  // Validate required fields
  const requiredFields = [
    'customer_id', 'first_name', 'last_name', 
    'project_id', 'executive_id', 'interaction_type', 'date'
  ];
  
  const missingFields = requiredFields.filter(field => !req.body[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({ 
      message: "Missing required fields",
      missingFields 
    });
  }

  const sql = `
    INSERT INTO customer_details 
    (customer_id, first_name, middle_name, last_name, project_id, 
     executive_id, interaction_type, date, unit_no, contact_number, remark)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    customer_id,
    first_name,
    middle_name || null,
    last_name,
    project_id,
    executive_id,
    interaction_type,
    date,
    unit_no || null,
    contact_number || null,
    remark || null
  ], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(200).json({ message: "Customer details added successfully" });
  });
};