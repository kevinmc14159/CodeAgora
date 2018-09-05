// Load Express module
const express = require('express');
// Create new router object
const router = express.Router();

// GET request handled by router
router.get('/test', (req, res) => res.json({msg: "Profile works"}));

// Return router object as the result of require call
module.exports = router;