import express from "express"
import patientService from "../services/patientService"
import { toNewPatientEntry, toNewEntry} from "../utils"

const router = express.Router()

router.get("/", (_req, res) => {
    const patient = patientService.getNonSensitiveData()
    return res.json(patient)
})

router.get("/:id", (req, res) => {
    const patient = patientService.getPatientById(req.params.id)
    if (patient) {
        return res.json(patient)
    } else {
        return res.status(404).send({ error: "Patient not found." })
    }
})

router.post("/", (req, res) => {
    try {
        const NewPatientEntry = toNewPatientEntry(req.body)
        const addedPatient = patientService.addPatient(NewPatientEntry)
        res.json(addedPatient)
    } catch (error: unknown) {
        let errorMessage = "Something went wrong"
        if (error instanceof Error) {
            errorMessage += " Error " + error.message
        }
        res.status(400).send(errorMessage)
    }
})

router.post("/:id/entries", (req, res) => {
    const patient = patientService.getPatientById(req.params.id)
    if (!patient) {
        return res.status(404).send({ error: "Patient not found."})
    }

    try {
        const newEntry = toNewEntry(req.body)
        const updatedPatient = patientService.addEntryToPatient(patient.id, newEntry)
        if (!updatedPatient) {
            return res.status(500).send({ error: "Failed to update patient with new entry." })
        }
       return res.json(updatedPatient)
    } catch (error: unknown) {
        let errorMessage = "Something went wrong."
        if (error instanceof Error) {
            errorMessage += " Error: " + error.message
        }
        return res.status(400).send(errorMessage)
    }
})

export default router