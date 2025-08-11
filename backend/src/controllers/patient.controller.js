import { Patient } from "../models/patient.model.js";
import validator from "validator";
import { ApiError } from "../utils/ApiError.js";
// NOTE: Other models like Story, Appointment are not used in this feature yet.

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const patient = await Patient.findById(userId);
    const accessToken = patient.generateAccessToken();
    const refreshToken = patient.generateRefreshToken();

    patient.refreshToken = refreshToken;

    await patient.save({ validateBeforeSave: false });

    return { accessToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Problem occurred while creating Access token");
  }
};

// Register Patient (from Feature 2)
const registerPatient = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Patient.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Patient already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 4) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    const patient = await Patient.create({ name, email, password });

    const createdPatient = await Patient.findById(patient._id).select(
      "-password"
    );

    if (!createdPatient) {
      return res.json({
        success: false,
        message: "Something went wrong while regitering the Patient",
      });
    }

    const accessToken = await generateAccessAndRefreshToken(patient._id);

    res.status(201).json({
      message: "Patient registered successfully",
      success: true,
      token: accessToken,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// login patient (New for Feature 3)
const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    const patient = await Patient.findOne({ email });

    if (!patient) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await patient.isPasswordCorrect(password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const { accessToken } = await generateAccessAndRefreshToken(patient._id);

    const loggedInPatient = await Patient.findById(patient._id).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: loggedInPatient,
      token: accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong during login",
    });
  }
};

export { 
  registerPatient, 
  loginPatient, 
};