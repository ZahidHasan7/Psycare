import { Patient } from "../models/patient.model.js";
import validator from "validator";
import { ApiError } from "../utils/ApiError.js";

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

// Register Patient
const registerPatient = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if patient exists
    const existing = await Patient.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Patient already exists" });
    }

    if (!validator.isEmail(email)) {
      // throw new ApiError(401, 'Please enter a valid email')
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 4) {
      // throw new ApiError(401, 'Please enter a strong password')
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
    // const refreshToken = patient.generateRefreshToken();

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

// NOTE: All other functions from this file will be added in later features.
export { 
  registerPatient, 
};