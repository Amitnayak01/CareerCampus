const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered. Please login.' });
    }
    const user = await User.create({ name, email, password, role: role === 'admin' ? 'student' : (role || 'student') });
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, profile: user.profile }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists.' });
    }
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account has been deactivated. Contact support.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    const token = generateToken(user._id);
    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, profile: user.profile, savedCareers: user.savedCareers }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedCareers', 'title category icon color shortDescription');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, profile, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, 'profile.qualification': profile?.qualification, 'profile.stream': profile?.stream, 'profile.interests': profile?.interests, 'profile.bio': profile?.bio, 'profile.phone': profile?.phone, 'profile.location': profile?.location },
      { new: true, runValidators: true }
    );
    res.json({ success: true, message: 'Profile updated successfully!', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile.' });
  }
};

// @desc    Save/unsave a career
// @route   POST /api/auth/save-career/:careerId
const toggleSaveCareer = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const careerId = req.params.careerId;
    const index = user.savedCareers.indexOf(careerId);
    let message;
    if (index === -1) {
      user.savedCareers.push(careerId);
      message = 'Career saved!';
    } else {
      user.savedCareers.splice(index, 1);
      message = 'Career removed from saved.';
    }
    await user.save();
    res.json({ success: true, message, savedCareers: user.savedCareers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update saved careers.' });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/auth/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    const total = await User.countDocuments({ role: 'student' });
    res.json({ success: true, total, users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
};


// @desc    Update user (admin)
// @route   PUT /api/auth/users/:id
const updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive, profile } = req.body;

    // Prevent admin from demoting themselves
    if (req.params.id === req.user.id && role === 'student') {
      return res.status(400).json({ error: 'Cannot change your own admin role.' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, isActive, profile },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ success: true, message: 'User updated successfully!', user });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ error: 'Email already in use.' });
    res.status(500).json({ error: 'Failed to update user.' });
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/auth/users/:id
const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account.' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user.' });
  }
};


module.exports = { register, login, getMe, updateProfile, toggleSaveCareer, getAllUsers, updateUser, deleteUser };
