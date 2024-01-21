// controllers/bookController.js
const Book = require('../models/book');
const BookRequest = require('../models/bookRequest');
const User = require('../models/user');
const nodemailer = require('nodemailer');

exports.requestBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    const user = await User.findById(userId);
    const book = await Book.findById(bookId).populate('admin');

    if (!user || !book) {
      return res.status(404).json({ message: 'User or book not found' });
    }

    const bookRequest = new BookRequest({
      user: userId,
      book: bookId,
      status: 'Pending',
    });

    await bookRequest.save();

    const adminEmail = book.admin.email;
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: adminEmail,
      subject: 'Book Purchase Request',
      text: `User ${user.email} has requested to buy the book "${book.title}".`,
    };

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error sending notification email to admin' });
      }
      console.log('Notification Email sent to admin: ' + info.response);
      res.json({ message: 'Book request sent to admin successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

