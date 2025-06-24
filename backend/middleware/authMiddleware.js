// ✅ backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
  const authHeader = req.header('Authorization');

  // ✅ Support both raw token and Bearer format
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No token provided' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach verified user payload
    req.user = {
      _id: verified._id,
      role: verified.role,
    };

    console.log('✅ Verified user:', req.user); // Optional for debugging

    next();
  } catch (err) {
    console.error('❌ Invalid token error:', err);
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// ✅ Role-based protection middleware
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Permission denied' });
    }
    next();
  };
};
