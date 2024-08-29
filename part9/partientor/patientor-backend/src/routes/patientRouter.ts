import express from "express"
import patientService from "../services/patientService"

const router = express.Router()

router.get("/", (_req, res) => {
    const patient = patientService.getNonSensitiveData()
    return res.json(patient)
})

export default router