// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profile:{type: String, required: false}
  // ... other user fields
});

module.exports = mongoose.model('User', userSchema);
