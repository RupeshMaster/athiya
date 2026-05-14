const express = require('express');
const Enquiry = require('../models/Enquiry');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/contact
// @desc    Submit a new contact enquiry
// @access  Private (Requires login)
router.post('/', protect, async (req, res) => {
  const { firstName, lastName, email, phone, project, message } = req.body;

  try {
    const enquiry = await Enquiry.create({
      userId: req.user._id,
      firstName,
      lastName,
      email,
      phone,
      project,
      message
    });

    res.status(201).json({ success: true, enquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
