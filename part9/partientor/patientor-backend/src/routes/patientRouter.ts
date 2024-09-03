import express from "express"
import patientService from "../services/patientService"
import toNewPatientEntry from "../utils"

const router = express.Router()

router.get("/", (_req, res) => {
    const patient = patientService.getNonSensitiveData()
    return res.json(patient)
})

router.post("/", (req, res) => {
    try {
        const NewPatientEntry = toNewPatientEntry(req.body)
        const addedPatient = patientService.addPatient(NewPatientEntry)
        res.json(addedPatient)
    } catch (error: unknown) {
        let errorMessage = "Something went wrong"
        if (error instanceof Error) {
            errorMessage += "Error " + error.message
        }
        res.status(400).send(errorMessage)
    }
})

export default router