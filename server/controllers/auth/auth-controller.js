const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

//register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create token
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        isAdmin: user.role === "admin" 
      },
      process.env.JWT_SECRET || "CLIENT_SECRET_KEY",
      { expiresIn: "24h" }
    );

    // Set cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    };

    // Set the cookie
    res.cookie("token", token, cookieOptions);

    console.log("Login successful, token set:", token);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
};

//logout

const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

//auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    console.log("Cookies received:", req.cookies); // Log all cookies
    console.log("Headers:", req.headers); // Log all headers
    
    const token = req.cookies.token;
    console.log("Token from cookies:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token found in cookies",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "CLIENT_SECRET_KEY");
      console.log("Decoded token:", decoded);
      req.user = decoded;

      // Check if user is admin
      if (!decoded.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "User is not an admin",
        });
      }

      next();
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(401).json({
        success: false,
        message: `Token verification failed: ${error.message}`,
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error in auth middleware",
      error: error.message
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };
