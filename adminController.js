const Admin = require('../models/admin');
const User = require('../models/user');
const otpService = require('../services/otpService');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

exports.addUser = async (req, res) => {
  try {
    const { email, password, profile } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    //   Password Hashing
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new user
    const newUser = new User({ email, password: hashedPassword, profile });

    await newUser.save();

    res.json({ message: 'User added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { email, password, profile } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    user.email = email || user.email;
    user.profile = profile || user.profile;

    // Update password if provided
    if (password) {
      // Hash the new password
      const hashedPassword = bcrypt.hashSync(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.getUser = async (req, res) => {
  try {
    // Get user
    const user = await User.findById(req.params.userId);
    res.json(user);
    res.json({ message: 'Get user logic to be implemented' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    //  send OTP notification to user email
    const user = await User.findOne({ email: req.body.email });
    const otp = otpService.generateOTP();
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    //  Delete user
     await User.findByIdAndDelete(req.params.userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Use your email configuration for nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sandeeptiwari237@gmail.com',
      pass: '1234',
    },
  });
  
  exports.forgetPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Check if admin with the given email exists
      const admin = await Admin.findOne({ email });
  
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      // Generate OTP
      const otp = otpService.generateOTP();
  
      // Save OTP in the database or any secure storage
      admin.resetPasswordOTP = otp;
  
      await admin.save();
  
      // Send OTP via email
      const mailOptions = {
        from: 'sandeeptiwari237@gmail.com',
        to: email,
        subject: 'Reset Password OTP',
        text: `Your OTP for password reset is: ${otp}`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Error sending OTP email' });
        }
        console.log('Email sent: ' + info.response);
        res.json({ message: 'OTP sent successfully' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  exports.resetPassword = async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
  
      // Check if admin with the given email exists
      const admin = await Admin.findOne({ email });
  
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      // Verify OTP
      if (!otpService.verifyOTP(otp, admin.resetPasswordOTP)) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      // Reset password
      const hashedPassword = bcrypt.hashSync(newPassword, 10);
      admin.password = hashedPassword;
      admin.resetPasswordOTP = undefined;
  
      await admin.save();
  
      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


