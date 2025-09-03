const db = require('../config/db');

// Add new customer
exports.addNewCustomer = (req, res) => {
  const { first_name, middle_name, last_name, mobile_number } = req.body;

  if (!first_name || !last_name) {
    return res.status(400).json({ message: "First name and last name are required" });
  }

  const sql = `
    INSERT INTO new_customers 
    (first_name, middle_name, last_name, mobile_number)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [
    first_name,
    middle_name || null,
    last_name,
    mobile_number || null
  ], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(200).json({ 
      message: "Customer added successfully",
      customerId: result.insertId 
    });
  });
};

// Search customers
exports.searchCustomers = (req, res) => {
  const { query } = req.query;

  if (!query || query.length < 2) {
    return res.status(400).json({ message: "Minimum 2 characters required" });
  }

  const searchQuery = `%${query}%`;
  
  const sql = `
    SELECT id, first_name, middle_name, last_name, mobile_number 
    FROM new_customers 
    WHERE 
      first_name LIKE ? OR
      middle_name LIKE ? OR
      last_name LIKE ? OR
      CONCAT(first_name, ' ', last_name) LIKE ? OR
      mobile_number LIKE ?
    LIMIT 10
  `;

  db.query(sql, [
    searchQuery,
    searchQuery,
    searchQuery,
    searchQuery,
    searchQuery
  ], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(200).json(results);
  });
};

// Get customer by ID
exports.getCustomerById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT id, first_name, middle_name, last_name, mobile_number 
    FROM new_customers 
    WHERE id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(results[0]);
  });
};