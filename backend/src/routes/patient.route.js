import express from 'express'
import { registerPatient } from '../controllers/patient.controller.js';
// NOTE: jwtVerify and other controllers will be used in later features.

const patientRouter = express.Router()

patientRouter.post('/register', registerPatient)

// NOTE: All other routes from this file will be added in later features.
export default patientRouter;