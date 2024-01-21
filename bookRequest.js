// models/bookRequest.js
const mongoose = require('mongoose');

const bookRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  status: { type: String, required: true },
});

module.exports = mongoose.model('BookRequest', bookRequestSchema);
