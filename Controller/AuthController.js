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

const AssignRole = async (req, res, next) => {
  try {
    const { roleId } = req.body;
    const user = await AuthSchema.findByIdAndUpdate(
      req.params.id,
      { $set: { role: roleId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ data: {}, success: false, message: "user not found" });
    }
    res.json({ data: user, success: true, message: "User Updated" });
  }
  catch (error) {
    next(error)
  }
}

async function getAllUsers(req, res, next) {
  try {
    const users = await AuthSchema.find().populate("role").populate({
      path: "role",
      populate: {
        path: "Permissions",
        model: "Permissions",
      },
    });
    res.json({success: true, message: "Permission Retrieved", data: users});
  } catch (error) {
    next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const {email, Username} = req.body;
    const user = await AuthSchema.findOne({email, Username });
    if(user){
      return res.status(404).json({data:{}, success: false, message: "User Already Exist" });
    }
    const newUser = new AuthSchema({ route, can });
    const saveUser = await newUser.save();
    res.status(201).json({success: true, message: "User Created", data: saveUser});
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await AuthSchema.findById(req.params.id).populate("role").populate({
      path: "role",
      populate: {
        path: "Permissions",
        model: "Permissions",
      },
    });
    if (!user) {
      return res.status(404).json({success: false, data: {}, message: "user not found" });
    }
    res.json({success: true, message: "user Created", data: user});
  } catch (error) {
    next(error);
  }
}

async function updateUserById(req, res, next) {
  try {
    const body = req.body
    const updateUser = await AuthSchema.findByIdAndUpdate(
      req.params.id,
      { body },
      { new: true } 
    );
    if (!updateUser) {
      return res.status(404).json({data:{}, success: false, message: "User not found" });
    }
    res.json({success: true, message: "Permission Updated", data: updatedPermission});
  } catch (error) {
    next(error);
  }
}

async function deleteUserById(req, res, next) {
  try {
    const deletedUser = await AuthSchema.findByIdAndRemove(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ success: true, data: {},message: "User not found" });
    }
    res.json({success: true, message: "User Deleted", data: {}});
  } catch (error) {
    next(error);
  }
}

module.exports = {
  signup,
  loginUser,
  AssignRole,
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById
};
