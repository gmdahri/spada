const AuthSchema = require('../Models/Auth');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


const loginUser = async (req, res, next) => {
  console.log('user', req.user)
  const { email, password } = req.body;
  try {
    const user = await AuthSchema.findOne({ email })

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "invalid email address" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials for username or password",
      });
    }
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    const token = jwt.sign(payload, 'auth-token', {
      expiresIn: "1d",
    });
    res.status(200).json({
      success: true,
      message: "Login Successfully",
      data: user,
      token,
    });
  } catch (err) {
    next(err);
  }
};



const signup = async (req, res) => {
  try {
    console.log("req", req.body)
    const { email, password } = req.body;

    const existingUser = await AuthSchema.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Using a salt factor of 10

    const newUser = new AuthSchema({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'Signup successful'
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  signup,
  loginUser
};
