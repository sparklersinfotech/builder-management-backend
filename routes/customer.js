// const express = require('express');
// const router = express.Router();
// const customerController = require('../controllers/customerController');

// // Customer Details Routes
// router.post('/customer-details', customerController.addCustomerDetails);
// router.get('/customer-search', customerController.searchCustomers);
// router.get('/projects', customerController.getProjects);
// router.get('/executives', customerController.getExecutives);
// router.post('/search-or-create', customerController.searchOrCreateCustomer);
// router.post('/add-project', customerController.addProjectDetails);

// module.exports = router;
const express = require("express")
const router = express.Router()
const customerController = require("../controllers/customerController")

// Search customers
router.get("/search", customerController.searchCustomers)

router.get("/all-customers", customerController.getAllCustomers)

// Add new customer
router.post("/add-customer", customerController.addNewCustomer)

// Add project details
router.post("/add-project-details", customerController.addProjectDetails)

// Get customer by ID
// router.get("/customer/:id", customerController.getCustomerById)

router.get("/customer/:id", customerController.getCustomerById) // Only numeric IDs

router.get("/customer-details/:customer_id", customerController.getCustomerDetails)

// Get projects and executives (existing)
router.get("/projects-customer", customerController.getProjects)
router.get("/executives", customerController.getExecutives)

module.exports = router
