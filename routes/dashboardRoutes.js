// const express = require("express")
// const router = express.Router()
// const dashboardController = require("../controllers/dashboardController")

// router.get("/counts", dashboardController.getDashboardCounts)
// router.get("/detailed-list", dashboardController.getDetailedList)
// router.get("/customer/:id", dashboardController.getCustomerDetail)

// module.exports = router



const express = require("express")
const router = express.Router()
const dashboardController = require("../controllers/dashboardController")

// Test route
router.get("/test", dashboardController.testController)

// Dashboard routes
router.get("/counts", dashboardController.getDashboardCounts)
router.get("/detailed-list", dashboardController.getDetailedList)
router.get("/customer/:id", dashboardController.getCustomerDetail)

// Additional utility routes
router.get("/interaction-types", dashboardController.getInteractionTypes)
router.get("/date-range", dashboardController.getDateRange)

module.exports = router
