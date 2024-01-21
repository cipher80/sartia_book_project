// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../config');
const Admin = require('../models/admin');


exports.authenticateAdmin = async (req, res, next) => {
  try {
    // Get the token from the request header
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ message: 'Access denied. Token not provided' });
    }

    //   Token verification
    const decoded = jwt.verify(token, config.secret);

    // Check if the decoded payload contains admin information
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({ message: 'Invalid token. Admin not found' });
    }

    // Add the admin object to the request for further use
    req.admin = admin;

    // Continue to the next middleware
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};


exports.isAdmin = (req, res, next) => {
  // Check if the admin object is available in the request
  if (!req.admin) {
    return res.status(403).json({ message: 'Forbidden. User is not an admin' });
  }

  next();
};
