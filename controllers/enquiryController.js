const db = require("../config/db")

// Get all enquiries with filters, search, and pagination
exports.getAllEnquiries = async (req, res) => {
  try {
    const { search = "", interaction_type = "", start_date = "", end_date = "", page = 1, limit = 15 } = req.query

    const offset = (page - 1) * limit
    const whereConditions = []
    const queryParams = []

    // Search functionality
    if (search && search.trim().length >= 2) {
      const searchTerm = `%${search.trim()}%`
      whereConditions.push(`(
        CONCAT(nc.first_name, ' ', IFNULL(nc.middle_name, ''), ' ', nc.last_name) LIKE ? 
        OR p.name LIKE ? 
        OR e.full_name LIKE ?
        OR nc.mobile_no LIKE ?
      )`)
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm)
    }

    // Filter by interaction type
    if (interaction_type && interaction_type !== "") {
      whereConditions.push("cd.interaction_type = ?")
      queryParams.push(interaction_type)
    }

    // Date range filter
    if (start_date && end_date) {
      whereConditions.push("cd.date BETWEEN ? AND ?")
      queryParams.push(start_date, end_date)
    } else if (start_date) {
      whereConditions.push("cd.date >= ?")
      queryParams.push(start_date)
    } else if (end_date) {
      whereConditions.push("cd.date <= ?")
      queryParams.push(end_date)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM customer_details cd
      JOIN new_customers nc ON cd.customer_id = nc.id
      LEFT JOIN projects p ON cd.project_id = p.id
      LEFT JOIN executives e ON cd.executive_id = e.id
      ${whereClause}
    `

    const [countResult] = await db.query(countQuery, queryParams)
    const totalRecords = countResult[0].total

    // Get enquiries with pagination
    const dataQuery = `
      SELECT 
        cd.id,
        cd.customer_id,
        cd.project_id,
        cd.executive_id,
        cd.interaction_type,
        cd.date,
        cd.unit_no,
        cd.remark,
        cd.created_at,
        CONCAT(nc.first_name, ' ', IFNULL(nc.middle_name, ''), ' ', nc.last_name) as full_name,
        nc.mobile_no,
        p.name as project_name,
        e.full_name as executive_name
      FROM customer_details cd
      JOIN new_customers nc ON cd.customer_id = nc.id
      LEFT JOIN projects p ON cd.project_id = p.id
      LEFT JOIN executives e ON cd.executive_id = e.id
      ${whereClause}
      ORDER BY cd.date DESC, cd.created_at DESC
      LIMIT ? OFFSET ?
    `

    const [enquiries] = await db.query(dataQuery, [...queryParams, Number.parseInt(limit), Number.parseInt(offset)])

    // Get interaction type statistics
    const statsQuery = `
      SELECT 
        interaction_type,
        COUNT(*) as count
      FROM customer_details cd
      JOIN new_customers nc ON cd.customer_id = nc.id
      LEFT JOIN projects p ON cd.project_id = p.id
      LEFT JOIN executives e ON cd.executive_id = e.id
      ${whereClause.replace(/cd\.interaction_type = \?/g, "1=1")}
      GROUP BY interaction_type
      ORDER BY count DESC
    `

    const statsParams = queryParams.filter((_, index) => {
      // Remove interaction_type parameter from stats query
      const conditionIndex = whereConditions.findIndex((condition) => condition.includes("cd.interaction_type = ?"))
      return conditionIndex === -1 || index !== conditionIndex
    })

    const [interactionStats] = await db.query(statsQuery, statsParams)

    res.status(200).json({
      success: true,
      data: enquiries,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords: totalRecords,
        recordsPerPage: Number.parseInt(limit),
        hasNextPage: Number.parseInt(page) < Math.ceil(totalRecords / limit),
        hasPrevPage: Number.parseInt(page) > 1,
      },
      stats: {
        total: totalRecords,
        searchTotal: enquiries.length,
        interactionTypes: interactionStats,
      },
    })
  } catch (error) {
    console.error("Error fetching enquiries:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries",
      error: error.message,
    })
  }
}

// Get enquiry details by ID
exports.getEnquiryById = async (req, res) => {
  try {
    const { id } = req.params

    const [enquiry] = await db.query(
      `
      SELECT 
        cd.*,
        CONCAT(nc.first_name, ' ', IFNULL(nc.middle_name, ''), ' ', nc.last_name) as full_name,
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
      WHERE cd.id = ?
    `,
      [id],
    )

    if (enquiry.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      })
    }

    res.status(200).json({
      success: true,
      data: enquiry[0],
    })
  } catch (error) {
    console.error("Error fetching enquiry details:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiry details",
      error: error.message,
    })
  }
}

// Export enquiries to Excel
exports.exportEnquiriesToExcel = async (req, res) => {
  try {
    const { search = "", interaction_type = "", start_date = "", end_date = "" } = req.query

    const whereConditions = []
    const queryParams = []

    // Apply same filters as getAllEnquiries
    if (search && search.trim().length >= 2) {
      const searchTerm = `%${search.trim()}%`
      whereConditions.push(`(
        CONCAT(nc.first_name, ' ', IFNULL(nc.middle_name, ''), ' ', nc.last_name) LIKE ? 
        OR p.name LIKE ? 
        OR e.full_name LIKE ?
        OR nc.mobile_no LIKE ?
      )`)
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm)
    }

    if (interaction_type && interaction_type !== "") {
      whereConditions.push("cd.interaction_type = ?")
      queryParams.push(interaction_type)
    }

    if (start_date && end_date) {
      whereConditions.push("cd.date BETWEEN ? AND ?")
      queryParams.push(start_date, end_date)
    } else if (start_date) {
      whereConditions.push("cd.date >= ?")
      queryParams.push(start_date)
    } else if (end_date) {
      whereConditions.push("cd.date <= ?")
      queryParams.push(end_date)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    const [enquiries] = await db.query(
      `
      SELECT 
        cd.id as 'Enquiry ID',
        CONCAT(nc.first_name, ' ', IFNULL(nc.middle_name, ''), ' ', nc.last_name) as 'Full Name',
        nc.mobile_no as 'Mobile Number',
        p.name as 'Project Name',
        e.full_name as 'Executive Name',
        cd.interaction_type as 'Interaction Type',
        cd.date as 'Date',
        cd.unit_no as 'Unit Number',
        cd.remark as 'Remark',
        cd.created_at as 'Created At'
      FROM customer_details cd
      JOIN new_customers nc ON cd.customer_id = nc.id
      LEFT JOIN projects p ON cd.project_id = p.id
      LEFT JOIN executives e ON cd.executive_id = e.id
      ${whereClause}
      ORDER BY cd.date DESC, cd.created_at DESC
    `,
      queryParams,
    )

    res.status(200).json({
      success: true,
      data: enquiries,
      message: "Enquiries data ready for export",
    })
  } catch (error) {
    console.error("Error exporting enquiries:", error)
    res.status(500).json({
      success: false,
      message: "Failed to export enquiries",
      error: error.message,
    })
  }
}

// Get unique interaction types for filter dropdown
exports.getInteractionTypes = async (req, res) => {
  try {
    const [types] = await db.query(
      `
      SELECT DISTINCT interaction_type, COUNT(*) as count
      FROM customer_details 
      WHERE interaction_type IS NOT NULL AND interaction_type != ''
      GROUP BY interaction_type
      ORDER BY count DESC, interaction_type ASC
    `,
    )

    res.status(200).json({
      success: true,
      data: types,
    })
  } catch (error) {
    console.error("Error fetching interaction types:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch interaction types",
      error: error.message,
    })
  }
}
