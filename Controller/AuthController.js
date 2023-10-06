const AuthSchema = require('../Models/Auth');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Log in a user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: john@example.com
 *               password: secret123
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                   example:
 *                     success: true
 *                     message: Login Successfully
 *                     data:
 *                       token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                       email: john@example.com
 *                       name: John Doe
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *               example:
 *                 success: false
 *                 message: Invalid credentials for username or password
 */

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
    }).populate({
      path: "quizzes",
      populate: {
        path: "questionIds",
        model: "Question",
        populate: [
          {
            path: "mainCategoryId",
            model: "MainCategory",
          },
          {
            path: "subCategoryId",
            model: "SubCategory",
          },
        ],
      },
    });
    res.json({ success: true, message: "Users Retrieved", data: users });
  } catch (error) {
    next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const { email, Username } = req.body;
    const user = await AuthSchema.findOne({ email, Username });
    if (user) {
      return res.status(404).json({ data: {}, success: false, message: "User Already Exist" });
    }
    const newUser = new AuthSchema({ email, Username });
    const saveUser = await newUser.save();
    res.status(201).json({ success: true, message: "User Created", data: saveUser });
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
    }).populate("quizzes");
    if (!user) {
      return res.status(404).json({ success: false, data: {}, message: "user not found" });
    }
    res.json({ success: true, message: "user Created", data: user });
  } catch (error) {
    next(error);
  }
}

async function updateUserById(req, res, next) {
  try {
    const body = req.body
    const updateUser = await AuthSchema.findByIdAndUpdate(
      req.params.id,
      body ,
      { new: true }
    );
    if (!updateUser) {
      return res.status(404).json({ data: {}, success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User Updated", data: updateUser });
  } catch (error) {
    next(error);
  }
}

async function deleteUserById(req, res, next) {
  try {
    const deletedUser = await AuthSchema.findByIdAndRemove(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ success: true, data: {}, message: "User not found" });
    }
    res.json({ success: true, message: "User Deleted", data: {} });
  } catch (error) {
    next(error);
  }
}

async function sendEmail(email, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      pool: true,
      auth: {
        user: "gm.webevis@gmail.com",
        pass: "zovrfkzboftaoyys",
      },
    });

    const mailOptions = {
      from: "ghulam@starcos.com",
      to: email,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
}

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (email !== undefined) {

      const user = await AuthSchema.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "email not found." });
      }

      const verificationCode = Math.floor(100000 + Math.random() * 900000);

      user.verificationCode = verificationCode;
      await user.save();

      const subject = "Password Reset Verification Code";
      const text = `Your verification code is: ${verificationCode}`;
      await sendEmail(user.email, subject, text);

      res.status(200).json({
        success: true,
        message: "Verification code sent to your email",
      });

    }
    else {
      return res
        .status(400)
        .json({ success: false, message: "email is not defined." });
    }
  } catch (err) {
    next(err);
  }
};

const verifyCode = async (req, res, next) => {
  const { email, code } = req.body;
  try {
    const user = await AuthSchema.findOne({ email: email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Username not found." });
    }

    if (user.verificationCode !== code) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid verification code" });
    }

    res.status(200).json({
      success: true,
      message: "Verification successful",
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  const { email, newPassword } = req.body;
  try {
    const user = await AuthSchema.findOne({ email: email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "email not found." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;

    user.verificationCode = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    next(err);
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
  deleteUserById,
  forgotPassword,
  verifyCode,
  resetPassword
};
