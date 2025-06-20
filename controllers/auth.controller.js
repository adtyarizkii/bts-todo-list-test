const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = catchAsync(async (req, res) => {
    const { username, email, password } = req.body;
  
    // Check if email is already used
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    // Check if username is already used
    const existingUsername = await User.findOne({ email });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username registered' });
    }
  
    // Create and save new user
    const user = new User({ username, email, password });
    await user.save();
  
    res.status(201).json({ user });
});

const login = catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
});

module.exports = {
  register,
  login
};
