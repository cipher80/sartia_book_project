// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const Admin = require('../models/admin');

exports.adminRegister = async (req, res) => {
    try {
      const { email, password, profile } = req.body;
  
      // Check if admin with the same email already exists
      const existingAdmin = await Admin.findOne({ email });
  
      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin with this email already exists' });
      }
  
      // Hash the password
      const hashedPassword = bcrypt.hashSync(password, 10);
  
      // Create new admin
      const newAdmin = new Admin({ email, password: hashedPassword, profile });
  
      await newAdmin.save();
  
      res.json({ message: 'Admin registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });

    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    //  JWT token Generation
    const token = jwt.sign({ id: admin._id, isAdmin: true }, config.secret);

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


