import express from 'express';
import { getDB } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard stats
router.get('/stats', authenticate, async (req, res, next) => {
  try {
    const db = getDB();
    const userId = req.user._id.toString();
    const role = req.user.role;

    let stats = {};

    if (role === 'admin') {
      // Admin dashboard stats
      const [
        totalOrders,
        pendingOrders,
        processingOrders,
        completedOrders,
        canceledOrders,
        receivedOrders,
        totalCustomers,
        totalEmployees
      ] = await Promise.all([
        db.collection('orders').countDocuments({}),
        db.collection('orders').countDocuments({ status: 'pending' }),
        db.collection('orders').countDocuments({ status: 'processing' }),
        db.collection('orders').countDocuments({ status: 'completed' }),
        db.collection('orders').countDocuments({ status: 'canceled' }),
        db.collection('orders').countDocuments({ status: 'received' }),
        db.collection('users').countDocuments({ role: 'user' }),
        db.collection('employees').countDocuments({})
      ]);

      // Calculate revenue
      const revenueData = await db.collection('orders').aggregate([
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$totalAmount' },
            paidAmount: { $sum: '$paidAmount' }
          }
        }
      ]).toArray();

      const revenue = revenueData[0] || { totalAmount: 0, paidAmount: 0 };

      stats = {
        totalOrders,
        pendingOrders,
        processingOrders,
        completedOrders,
        canceledOrders,
        receivedOrders,
        totalCustomers,
        totalEmployees,
        totalRevenue: revenue.paidAmount,
        totalDue: revenue.totalAmount - revenue.paidAmount,
        totalAmount: revenue.totalAmount
      };
    } else if (role === 'employee') {
      // Employee dashboard stats
      const [
        assignedOrders,
        pendingOrders,
        processingOrders,
        completedOrders
      ] = await Promise.all([
        db.collection('orders').countDocuments({ assignedEmployeeId: userId }),
        db.collection('orders').countDocuments({ assignedEmployeeId: userId, status: 'pending' }),
        db.collection('orders').countDocuments({ assignedEmployeeId: userId, status: 'processing' }),
        db.collection('orders').countDocuments({ assignedEmployeeId: userId, status: 'completed' })
      ]);

      stats = {
        assignedOrders,
        pendingOrders,
        processingOrders,
        completedOrders
      };
    } else {
      // User dashboard stats
      const [
        totalOrders,
        pendingOrders,
        processingOrders,
        completedOrders,
        canceledOrders,
        receivedOrders
      ] = await Promise.all([
        db.collection('orders').countDocuments({ userId }),
        db.collection('orders').countDocuments({ userId, status: 'pending' }),
        db.collection('orders').countDocuments({ userId, status: 'processing' }),
        db.collection('orders').countDocuments({ userId, status: 'completed' }),
        db.collection('orders').countDocuments({ userId, status: 'canceled' }),
        db.collection('orders').countDocuments({ userId, status: 'received' })
      ]);

      // Calculate user spending
      const spendingData = await db.collection('orders').aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$totalAmount' },
            paidAmount: { $sum: '$paidAmount' }
          }
        }
      ]).toArray();

      const spending = spendingData[0] || { totalAmount: 0, paidAmount: 0 };

      stats = {
        totalOrders,
        pendingOrders,
        processingOrders,
        completedOrders,
        canceledOrders,
        receivedOrders,
        totalAmountSpent: spending.totalAmount,
        totalAmountPaid: spending.paidAmount
      };
    }

    res.json(stats);
  } catch (error) {
    next(error);
  }
});

export default router;

