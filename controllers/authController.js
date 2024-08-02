const User = require("../models/Schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();


const generateUniqueToken = () => {
  return crypto.randomBytes(16).toString("hex");
};

// Signup controller
exports.signup = async (req, res) => {
  const { name, email, password, telephone, company } = req.body;
  try {
    console.log("Received request with body:", req.body); // Debugging: Log the incoming request body
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ error: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const token = generateUniqueToken();
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      telephone,
      company,
      token,
    });
    console.log("Creating new user with:", newUser);
    await newUser.save();
    res.status(201).json({ error: "User created successfully" });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: "Server Error" });
  }
};

// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password input
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined.");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ result: user, token, userToken: user.token });
  } catch (error) {
    console.error(`Error in login: ${error.message}`, error);
    res.status(500).json({ error: "Server Error: " + error.message });
  }
};
