import express from 'express';
import bcrypt from 'bcryptjs';
import { getDB } from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Get all employees
router.get('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const db = getDB();
    const employees = await db.collection('employees')
      .find({})
      .project({ password: 0 })
      .toArray();
    
    res.json(employees);
  } catch (error) {
    next(error);
  }
});

// Get employee by ID
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDB();

    // Employees can view their own profile, admins can view any
    if (req.user.role === 'employee' && req.user._id.toString() !== id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const employee = await db.collection('employees').findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    );

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    next(error);
  }
});

// Create employee (Admin only)
router.post('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { email, password, fullName, phone, address, specialization } = req.body;

    if (!email || !password || !fullName || !phone || !address) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const db = getDB();
    
    // Check if employee already exists
    const existingEmployee = await db.collection('employees').findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ error: 'Employee already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create employee
    const employee = {
      email,
      password: hashedPassword,
      fullName,
      phone,
      address,
      role: 'employee',
      specialization: specialization || null,
      createdAt: new Date()
    };

    const result = await db.collection('employees').insertOne(employee);
    const employeeId = result.insertedId;

    // Remove password from response
    delete employee.password;
    employee._id = employeeId;

    res.status(201).json({
      message: 'Employee created successfully',
      employee
    });
  } catch (error) {
    next(error);
  }
});

// Update employee
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, phone, address, email, specialization, password } = req.body;
    const db = getDB();

    // Employees can only update their own profile, admins can update any
    if (req.user.role === 'employee' && req.user._id.toString() !== id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (email) updateData.email = email;
    if (specialization !== undefined) updateData.specialization = specialization;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    updateData.updatedAt = new Date();

    const result = await db.collection('employees').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after', projection: { password: 0 } }
    );

    if (!result.value) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(result.value);
  } catch (error) {
    next(error);
  }
});

// Delete employee (Admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = getDB();

    // Check if employee has assigned orders
    const assignedOrders = await db.collection('orders').countDocuments({
      assignedEmployeeId: id,
      status: { $in: ['pending', 'processing'] }
    });

    if (assignedOrders > 0) {
      return res.status(400).json({
        error: 'Cannot delete employee with active orders',
        activeOrders: assignedOrders
      });
    }

    const result = await db.collection('employees').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;

