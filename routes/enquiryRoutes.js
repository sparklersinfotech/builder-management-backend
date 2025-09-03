const express = require("express")
const router = express.Router()
const enquiryController = require("../controllers/enquiryController")

// Get all enquiries with filters and pagination
router.get("/all", enquiryController.getAllEnquiries)

// Get enquiry by ID
router.get("/:id", enquiryController.getEnquiryById)

// Export enquiries to Excel
router.get("/export", enquiryController.exportEnquiriesToExcel)
// router.get("/enquiries/export", exportEnquiriesToExcel);

// Get interaction types for filter
router.get("/interaction-types", enquiryController.getInteractionTypes)

module.exports = router
