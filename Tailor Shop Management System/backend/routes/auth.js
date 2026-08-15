import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB } from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Register new user
router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, fullName, phone, address } = req.body;

    if (!email || !password || !fullName || !phone || !address) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const db = getDB();
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      email,
      password: hashedPassword,
      fullName,
      phone,
      address,
      role: 'user',
      createdAt: new Date()
    };

    const result = await db.collection('users').insertOne(user);
    const userId = result.insertedId;

    // Generate token
    const token = jwt.sign(
      { userId: userId.toString(), role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Remove password from response
    delete user.password;
    user._id = userId;

    res.status(201).json({
      message: 'User created successfully',
      user,
      token
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = getDB();
    
    // Check users collection
    let user = await db.collection('users').findOne({ email });
    let collection = 'users';

    // If not found, check employees collection
    if (!user) {
      user = await db.collection('employees').findOne({ email });
      collection = 'employees';
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Remove password from response
    delete user.password;

    res.json({
      message: 'Login successful',
      user,
      token
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', authenticate, async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
});

export default router;

