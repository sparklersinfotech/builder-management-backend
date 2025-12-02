const db = require("../config/db")

// Search customers by name or mobile
exports.searchCustomers = async (req, res) => {
  try {
    const { search } = req.query

    if (!search || search.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search term must be at least 2 characters",
      })
    }

    const searchTerm = `%${search.trim()}%`

    const [customers] = await db.query(
      `
      SELECT id, first_name, middle_name, last_name, mobile_no,
             CONCAT(first_name, ' ', IFNULL(middle_name, ''), ' ', last_name) as full_name
      FROM new_customers 
      WHERE first_name LIKE ? 
         OR middle_name LIKE ? 
         OR last_name LIKE ? 
         OR mobile_no LIKE ?
         OR CONCAT(first_name, ' ', IFNULL(middle_name, ''), ' ', last_name) LIKE ?
      ORDER BY first_name
      LIMIT 10
    `,
      [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm],
    )

    res.status(200).json({
      success: true,
      data: customers,
      found: customers.length > 0,
    })
  } catch (error) {
    console.error("Error searching customers:", error)
    res.status(500).json({
      success: false,
      message: "Failed to search customers",
      error: error.message,
    })
  }
}

exports.getAllCustomers = async (req, res) => {
  try {
    const [customers] = await db.query(
      `
      SELECT id, first_name, middle_name, last_name, mobile_no,
             CONCAT(first_name, ' ', IFNULL(middle_name, ''), ' ', last_name) as full_name,
             created_at
      FROM new_customers 
      ORDER BY created_at DESC
    `,
    )

    res.status(200).json({
      success: true,
      data: customers,
      total: customers.length,
    })
  } catch (error) {
    console.error("Error fetching all customers:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
      error: error.message,
    })
  }
}

// Add new customer
exports.addNewCustomer = async (req, res) => {
  try {
    const { first_name, middle_name, last_name, mobile_no } = req.body

    if (!first_name || !last_name || !mobile_no) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, and mobile number are required",
      })
    }

    // Check if mobile number already exists
    const [existingCustomer] = await db.query("SELECT id FROM new_customers WHERE mobile_no = ?", [mobile_no])

    if (existingCustomer.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Customer with this mobile number already exists",
      })
    }

    const [result] = await db.query(
      `
      INSERT INTO new_customers (first_name, middle_name, last_name, mobile_no)
      VALUES (?, ?, ?, ?)
    `,
      [first_name, middle_name || null, last_name, mobile_no],
    )

    res.status(201).json({
      success: true,
      message: "Customer added successfully",
      customer_id: result.insertId,
    })
  } catch (error) {
    console.error("Error adding customer:", error)
    res.status(500).json({
      success: false,
      message: "Failed to add customer",
      error: error.message,
    })
  }
}

// Add project details for existing customer
exports.addProjectDetails = async (req, res) => {
  try {
    const { customer_id, project_id, executive_id, interaction_type, date, unit_no, remark } = req.body

    console.log("Received data:", { customer_id, project_id, executive_id, interaction_type, date, unit_no, remark })

    if (!customer_id || !project_id || !executive_id || !interaction_type || !date) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
        received: { customer_id, project_id, executive_id, interaction_type, date },
      })
    }

    // Verify customer exists
    const [customer] = await db.query("SELECT id FROM new_customers WHERE id = ?", [customer_id])
    if (customer.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
        customer_id: customer_id,
      })
    }

    // Verify project exists (assuming you have a projects table)
    const [project] = await db.query("SELECT id FROM projects WHERE id = ?", [project_id])
    if (project.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
        project_id: project_id,
      })
    }

    // Verify executive exists (assuming you have an executives table)
    const [executive] = await db.query("SELECT id FROM executives WHERE id = ?", [executive_id])
    if (executive.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Executive not found",
        executive_id: executive_id,
      })
    }

    const [result] = await db.query(
      `
      INSERT INTO customer_details 
      (customer_id, project_id, executive_id, interaction_type, date, unit_no, remark)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [customer_id, project_id, executive_id, interaction_type, date, unit_no || null, remark || null],
    )

    res.status(201).json({
      success: true,
      message: "Project details added successfully",
      detail_id: result.insertId,
    })
  } catch (error) {
    console.error("Error adding project details:", error)
    res.status(500).json({
      success: false,
      message: "Failed to add project details",
      error: error.message,
    })
  }
}

// Get customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params

    const [customer] = await db.query(
      `
      SELECT id, first_name, middle_name, last_name, mobile_no,
             CONCAT(first_name, ' ', IFNULL(middle_name, ''), ' ', last_name) as full_name
      FROM new_customers 
      WHERE id = ?
    `,
      [id],
    )

    if (customer.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      })
    }

    res.status(200).json({
      success: true,
      data: customer[0],
    })
  } catch (error) {
    console.error("Error fetching customer:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer",
      error: error.message,
    })
  }
}

// Get Projects (existing)
exports.getProjects = async (req, res) => {
  try {
    const [projects] = await db.query("SELECT id, name FROM projects")
    res.status(200).json({
      success: true,
      data: projects,
    })
  } catch (error) {
    console.error("Error fetching projects:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message,
    })
  }
}

// Get Executives (existing)
exports.getExecutives = async (req, res) => {
  try {
    const [executives] = await db.query("SELECT id, full_name FROM executives")
    res.status(200).json({
      success: true,
      data: executives,
    })
  } catch (error) {
    console.error("Error fetching executives:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch executives",
      error: error.message,
    })
  }
}

// Get customer details with project information
// exports.getCustomerDetails = async (req, res) => {
//   try {
//     const { customer_id } = req.params

//     const [details] = await db.query(
//       `
//       SELECT 
//         cd.*,
//         nc.first_name,
//         nc.middle_name,
//         nc.last_name,
//         nc.mobile_no,
//         p.name as project_name,
//         e.full_name as executive_name
//       FROM customer_details cd
//       JOIN new_customers nc ON cd.customer_id = nc.id
//       LEFT JOIN projects p ON cd.project_id = p.id
//       LEFT JOIN executives e ON cd.executive_id = e.id
//       WHERE cd.customer_id = ?
//       ORDER BY cd.date DESC
//     `,
//       [customer_id],
//     )

//     res.status(200).json({
//       success: true,
//       data: details,
//     })
//   } catch (error) {
//     console.error("Error fetching customer details:", error)
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch customer details",
//       error: error.message,
//     })
//   }
// }

exports.getCustomerDetails = async (req, res) => {
  try {
    const { customer_id } = req.params;

    const [details] = await db.query(
      `
      SELECT 
        cd.*,
        nc.first_name,
        nc.middle_name,
        nc.last_name,
        nc.mobile_no,
        p.name as project_name,
        e.full_name as executive_name
      FROM customer_details cd
      JOIN new_customers nc ON cd.customer_id = nc.id
      LEFT JOIN projects p ON cd.project_id = p.id
      LEFT JOIN executives e ON cd.executive_id = e.id
      WHERE cd.customer_id = ?
      ORDER BY cd.created_at DESC, cd.id DESC
    `,
      [customer_id]
    );

    res.status(200).json({
      success: true,
      data: details,
    });
  } catch (error) {
    console.error("Error fetching customer details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer details",
      error: error.message,
    });
  }
};





exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params

    const [customer] = await db.query(
      `
      SELECT id, first_name, middle_name, last_name, mobile_no,
             CONCAT(first_name, ' ', IFNULL(middle_name, ''), ' ', last_name) as full_name
      FROM new_customers 
      WHERE id = ?
    `,
      [id],
    )

    if (customer.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      })
    }

    res.status(200).json({
      success: true,
      data: customer[0],
    })
  } catch (error) {
    console.error("Error fetching customer:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer",
      error: error.message,
    })
  }
}

