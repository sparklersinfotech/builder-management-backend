
const pool = require("../config/db")

// Test controller
exports.testController = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT 1 as test")
    res.json({ message: "Dashboard controller working!", dbTest: rows[0] })
  } catch (error) {
    console.error("Test error:", error)
    res.status(500).json({ message: "Controller test failed", error: error.message })
  }
}

// Get dashboard counts based on date range - Updated to calculate pending properly
exports.getDashboardCounts = async (req, res) => {
  try {
    console.log("Dashboard counts API called")
    console.log("Query params:", req.query)
    const { fromDate, toDate } = req.query

    // Validate dates
    if (!fromDate || !toDate) {
      return res.status(400).json({
        message: "From date and to date are required",
        received: { fromDate, toDate },
      })
    }

    const sql = `
      SELECT 
        SUM(CASE WHEN interaction_type = 'Meeting Done' THEN 1 ELSE 0 END) as total_meetings,
        SUM(CASE WHEN interaction_type = 'Booked' THEN 1 ELSE 0 END) as total_bookings,
        SUM(CASE WHEN interaction_type = 'Enquiry' THEN 1 ELSE 0 END) as total_enquiry
      FROM customer_details 
      WHERE date BETWEEN ? AND ?
    `

    console.log("Executing SQL:", sql)
    console.log("With params:", [fromDate, toDate])
    const [rows] = await pool.execute(sql, [fromDate, toDate])
    console.log("Query result:", rows[0])

    // Calculate pending as meetings - bookings
    const totalMeetings = Number(rows[0].total_meetings || 0)
    const totalBookings = Number(rows[0].total_bookings || 0)
    const totalPending = totalMeetings - totalBookings
    const totalEnquiry = Number(rows[0].total_enquiry || 0)

    const response = {
      total_meetings: totalMeetings,
      total_bookings: totalBookings,
      total_pending: totalPending,
      total_enquiry: totalEnquiry,
    }

    res.status(200).json(response)
  } catch (error) {
    console.error("Database error:", error)
    res.status(500).json({
      message: "Database error",
      error: error.message,
    })
  }
}




exports.getDetailedList = async (req, res) => {
  try {
    console.log("Detailed list API called");
    console.log("Query params:", req.query);
    const { type, fromDate, toDate, search } = req.query;

    if (!fromDate || !toDate) {
      return res.status(400).json({
        message: "From date and to date are required",
      });
      
    }

    let whereCondition = "WHERE cd.date BETWEEN ? AND ?";
    const queryParams = [fromDate, toDate];

    // Handle different types including pending logic
    if (type && type !== "total_projects") {
      let interactionCondition = "";

      switch (type) {
        case "total_bookings":
          interactionCondition = "AND cd.interaction_type = 'Booked'";
          break;
        case "total_meetings":
          interactionCondition = "AND cd.interaction_type = 'Meeting Done'";
          break;
        case "total_pending":
          interactionCondition = `AND cd.interaction_type = 'Meeting Done' 
            AND cd.customer_id NOT IN (
              SELECT DISTINCT customer_id 
              FROM customer_details 
              WHERE interaction_type = 'Booked' 
              AND date BETWEEN ? AND ?
            )`;
          queryParams.push(fromDate, toDate);
          break;
        case "total_enquiry":
          interactionCondition = "AND cd.interaction_type = 'Enquiry'";
          break;
      }

      whereCondition += ` ${interactionCondition}`;
    }

    // Add search filter
    if (search && search.trim() !== "") {
      whereCondition += " AND (cd.remark LIKE ? OR cd.unit_no LIKE ? OR c.mobile_no LIKE ?)";
      const searchTerm = `%${search.trim()}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    // Updated query with all necessary joins
    const sql = `
      SELECT 
        cd.*,
        e.full_name AS executive_name,
        CONCAT(c.first_name) AS customer_name,
        c.mobile_no AS customer_mobile,
        p.name AS project_name
      FROM customer_details cd
      LEFT JOIN executives e ON cd.executive_id = e.id
      LEFT JOIN new_customers c ON cd.customer_id = c.id
      LEFT JOIN projects p ON cd.project_id = p.id
      ${whereCondition}
      ORDER BY cd.date DESC
      LIMIT 100
    `;

    console.log("Executing SQL:", sql);
    console.log("With params:", queryParams);
    const [rows] = await pool.execute(sql, queryParams);
    console.log("Query results count:", rows.length);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      message: "Database error",
      error: error.message,
    });
  }
};

exports.getCustomerDetail = async (req, res) => {
  try {
    console.log("Customer detail API called")
    console.log("Params:", req.params)
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ message: "Customer ID is required" })
    }

    // Updated query without project joins
    const sql = `
      SELECT 
        cd.*,
        e.executive_name,
        e.contact_number as executive_contact
      FROM customer_details cd
      LEFT JOIN executives e ON cd.executive_id = e.executive_id
      WHERE cd.id = ?
    `

    console.log("Executing SQL:", sql)
    console.log("With params:", [id])
    const [rows] = await pool.execute(sql, [id])

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
        id: id,
      })
    }

    console.log("Customer found:", rows[0])
    res.status(200).json(rows[0])
  } catch (error) {
    console.error("Database error:", error)
    res.status(500).json({
      message: "Database error",
      error: error.message,
    })
  }
}

// Get all interaction types for dropdown/filter
exports.getInteractionTypes = async (req, res) => {
  try {
    const sql = `
      SELECT DISTINCT interaction_type 
      FROM customer_details 
      WHERE interaction_type IS NOT NULL 
      ORDER BY interaction_type
    `
    const [rows] = await pool.execute(sql)
    const types = rows.map((row) => row.interaction_type)
    res.status(200).json(types)
  } catch (error) {
    console.error("Database error:", error)
    res.status(500).json({
      message: "Database error",
      error: error.message,
    })
  }
}

// Get date range of available data
exports.getDateRange = async (req, res) => {
  try {
    const sql = `
      SELECT 
        MIN(date) as min_date,
        MAX(date) as max_date,
        COUNT(*) as total_records
      FROM customer_details
    `
    const [rows] = await pool.execute(sql)
    res.status(200).json(rows[0])
  } catch (error) {
    console.error("Database error:", error)
    res.status(500).json({
      message: "Database error",
      error: error.message,
    })
  }
}

