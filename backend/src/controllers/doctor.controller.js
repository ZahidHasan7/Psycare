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

const doctorRegister = async (req, res) => {
  try {
    // --- DATA RECEPTION AND VALIDATION ---

    // STEP 1: Destructure fields matching EXACTLY what the frontend sends.
    const {
      fullName,
      email,
      password,
      phoneNumber,       // CHANGED from 'phone'
      specializations,   // CHANGED from 'specialization'
      bio,
      address,
      education,         // This is now a JSON string: '{"degree":"...", "university":"...", "year":"..."}'
      workExperience,
      licenseNumber,     // CHANGED from 'license'
      appointmentFee,    // CHANGED from 'fees'
    } = req.body;

    // STEP 2: Handle file uploads from Multer/Cloudinary. This part was already good!
    const certificateFile = req.files?.certificate?.[0];
    const profilePicFile = req.files?.profilePic?.[0];

    // --- VALIDATION LOGIC (Mostly unchanged, but simplified) ---

    // Check for missing fields
    const requiredFields = { fullName, email, password, phoneNumber, specializations, bio, address, education, workExperience, licenseNumber, appointmentFee };
    for (const [key, value] of Object.entries(requiredFields)) {
        if (!value || value.trim() === "") {
            return res.status(400).json({ success: false, message: `Field is required: ${key}` });
        }
    }

    if (!certificateFile || !profilePicFile) {
      return res.status(400).json({ success: false, message: "Both certificate and profile picture are required" });
    }

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(409).json({ success: false, message: "A doctor with this email already exists" }); // 409 Conflict is more specific
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 6) { // It's good practice to enforce a slightly longer password
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }

    // --- DATA PREPARATION ---

    // STEP 3: Parse the 'education' JSON string from the form.
    let educationData;
    try {
        educationData = JSON.parse(education);
    } catch (error) {
        return res.status(400).json({ success: false, message: "Invalid education data format." });
    }

    // --- DATABASE CREATION ---

    // STEP 4: Create the doctor object with fields matching your 'doctor.model.js'
    const doctor = await Doctor.create({
      fullName,
      email,
      password,
      phone: phoneNumber,                 // Map to 'phone'
      specialization: specializations.split(",").map(s => s.trim()), // Clean and split string into an array
      bio,
      address,
      workExperience,
      license: licenseNumber,             // Map to 'license'
      fees: Number(appointmentFee),       // Map to 'fees' and ensure it's a Number
      certificate: certificateFile.path,  // Get path from Cloudinary
      profilePic: profilePicFile.path,    // Get path from Cloudinary
      // Map education fields
      degree: educationData.degree,
      medicalCollege: educationData.university, // Map 'university' to 'medicalCollege'
      yearOfCompletion: educationData.year,
    });
    
    // --- SUCCESS RESPONSE ---
    
    // STEP 5: Send a simple success response. No token, no auto-login.
    return res.status(201).json({
      success: true,
      message: "Doctor registered successfully. Please log in.",
    });

  } catch (error) {
    console.error("Register Doctor Error:", error);
    // Send a generic server error
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred during registration.",
    });
  }
};

// NOTE: All other functions from this file will be added in later features.
export {
  doctorRegister,
};