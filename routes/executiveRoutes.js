const express = require('express');
const router = express.Router();
const executiveController = require('../controllers/executiveController');

router.post('/add', executiveController.addExecutive);
router.get('/all', executiveController.getAllExecutives);
router.put('/:id', executiveController.updateExecutive);
router.delete('/:id', executiveController.deleteExecutive);

module.exports = router;
