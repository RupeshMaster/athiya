const express = require('express');
const User = require('../models/User');
const Enquiry = require('../models/Enquiry');
const Project = require('../models/Project');
const Sale = require('../models/Sale');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/admin/stats
// @desc    Get dashboard metrics, users, enquiries, and sales
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalEnquiries = await Enquiry.countDocuments({});
    const totalProjects = await Project.countDocuments({});
    
    // Aggregate sales to calculate total sales revenue
    const salesAggregate = await Sale.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);
    
    const totalSalesAmount = salesAggregate.length > 0 ? salesAggregate[0].totalAmount : 0;
    
    // Fetch detailed lists for dashboard display
    const sales = await Sale.find({}).sort({ createdAt: -1 });
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 }).populate('userId', 'name email');
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });

    res.json({
      metrics: {
        totalUsers,
        totalSales: totalSalesAmount,
        totalEnquiries,
        totalProjects
      },
      sales,
      enquiries,
      users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/admin/sales
// @desc    Log a new sale
// @access  Private/Admin
router.post('/sales', protect, admin, async (req, res) => {
  const { project, amount, clientName, clientEmail, status, date } = req.body;

  try {
    if (!project || !amount || !clientName || !clientEmail) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const sale = await Sale.create({
      project,
      amount,
      clientName,
      clientEmail,
      status,
      date: date || Date.now()
    });

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/enquiries
// @desc    Get all enquiries
// @access  Private/Admin
router.get('/enquiries', protect, admin, async (req, res) => {
  try {
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 }).populate('userId', 'name email');
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
