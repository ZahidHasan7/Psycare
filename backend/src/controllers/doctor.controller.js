import { Doctor } from "../models/doctor.model.js";
import validator from "validator";
import { ApiError } from "../utils/ApiError.js";

// Utility to generate access and refresh token
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const doctor = await Doctor.findById(userId);
    const accessToken = doctor.generateAccessToken();
    const refreshToken = doctor.generateRefreshToken();

    doctor.refreshToken = refreshToken;
    await doctor.save({ validateBeforeSave: false });

    return { accessToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Problem occurred while creating Access token");
  }
};

// Doctor Register (from Feature 2)
const doctorRegister = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phoneNumber,
      specializations,
      bio,
      address,
      education,
      workExperience,
      licenseNumber,
      appointmentFee,
    } = req.body;

    const certificateFile = req.files?.certificate?.[0];
    const profilePicFile = req.files?.profilePic?.[0];

    // --- VALIDATION LOGIC ---
    const requiredFields = { fullName, email, password, phoneNumber, specializations, bio, address, education, workExperience, licenseNumber, appointmentFee };
    for (const [key, value] of Object.entries(requiredFields)) {
        if (!value || (typeof value === 'string' && value.trim() === "")) {
            return res.status(400).json({ success: false, message: `Field is required: ${key}` });
        }
    }
    if (!certificateFile || !profilePicFile) {
      return res.status(400).json({ success: false, message: "Both certificate and profile picture are required" });
    }
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(409).json({ success: false, message: "A doctor with this email already exists" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }

    // --- DATA PREPARATION ---
    let educationData;
    try {
        educationData = JSON.parse(education);
    } catch (error) {
        return res.status(400).json({ success: false, message: "Invalid education data format." });
    }

    // --- DATABASE CREATION ---
    const doctor = await Doctor.create({
      fullName,
      email,
      password,
      phone: phoneNumber,
      specialization: specializations.split(",").map(s => s.trim()),
      bio,
      address,
      workExperience,
      license: licenseNumber,
      fees: Number(appointmentFee),
      certificate: certificateFile.path,
      profilePic: profilePicFile.path,
      degree: educationData.degree,
      medicalCollege: educationData.university,
      yearOfCompletion: educationData.year,
    });
    
    return res.status(201).json({
      success: true,
      message: "Doctor registered successfully. Please log in.",
    });

  } catch (error) {
    console.error("Register Doctor Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred during registration.",
    });
  }
};

// Doctor Login (New for Feature 3)
const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await doctor.isPasswordCorrect(password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const { accessToken } = await generateAccessAndRefreshToken(doctor._id);

    const loggedInDoctor = await Doctor.findById(doctor._id).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: loggedInDoctor,
      token: accessToken,
    });
  } catch (error) {
    console.log("Doctor login error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong during login",
    });
  }
};

export {
  doctorRegister,
  doctorLogin,
};