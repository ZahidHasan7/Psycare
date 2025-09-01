import mongoose from "mongoose";
import { Appointment } from "../models/appointment.model.js";
// At the top of the file, add this import if it's not there
import { Patient } from "../models/patient.model.js";

// ... (keep your existing functions)

// --- PASTE THIS NEW FUNCTION INTO THE FILE ---
// This secure function gets appointments for the CURRENTLY LOGGED-IN doctor.
const getLoggedInDoctorAppointments = async (req, res) => {
  try {
    // 1. Get the doctor's ID from req.user, which is added by your jwtVerify middleware.
    const doctorId = req.user._id;

    // 2. Find all appointments matching the doctor's ID.
    // We use .populate() to fetch details from the linked 'Patient' model.
    const appointments = await Appointment.find({ doctorId: doctorId })
      .populate('patientId', ' name email') // Fetches patient's name and email
      .sort({ createdAt: -1 }); // Shows the newest appointments first

    // 3. Send a successful response with the appointment data.
    res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      data: appointments,
    });

  } catch (error) {
    console.error("Error fetching logged-in doctor's appointments:", error);
    res.status(500).json({ success: false, message: 'Server error while fetching appointments' });
  }
};
// --- END OF NEW FUNCTION ---
const getAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    // console.log(doctorId)
    const objectId = new mongoose.Types.ObjectId(doctorId);
    // console.log(typeof objectId)

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ success: false, message: "Invalid doctor ID" });
    }


    const appointments = await Appointment.find({ doctorId: objectId });
    res.status(200).json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching appointments' });
  }
};

const getAppointmentsByPatient = async (req, res) => {
  const id = req.user._id;

  if (!id) {
    return res.status(400).json({ success: false, message: "Invalid patient ID" });
  }

  try {
    const appointments = await Appointment.find({ patientId: id })
      .populate('doctorId', 'fullName profilePic') 
      .lean();

    res.status(200).json({ success: true, appointments });
  } catch (error) {

  }
}


export {
  getAppointmentsByDoctor,
  getAppointmentsByPatient,
  getLoggedInDoctorAppointments // Add this
}