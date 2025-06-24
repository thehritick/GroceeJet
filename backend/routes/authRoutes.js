// ✅ File: backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();

// ✅ Make sure the path is correct!
const { register, login } = require('../controllers/authController'); // Make sure both are defined

// 🛂 Define routes
router.post('/register', register); // ✅ register must be a function
router.post('/login', login);       // ✅ login must be a function

module.exports = router;
