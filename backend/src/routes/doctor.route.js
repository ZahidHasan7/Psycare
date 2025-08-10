import express from 'express'
import { doctorRegister } from '../controllers/doctor.controller.js';
import { doctorFileUpload } from '../middlewares/upload.js';
// NOTE: jwtVerify and other controllers will be used in later features.

const doctorRouter = express.Router()

doctorRouter.post('/register', doctorFileUpload,  doctorRegister)

// NOTE: All other routes from this file will be added in later features.
export default doctorRouter;