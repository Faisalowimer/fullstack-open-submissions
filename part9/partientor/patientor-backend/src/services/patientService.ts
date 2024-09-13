import data from "../data/patient"
import { PatientEntry, NonSensitiveEntry, NewPatientEntry, Entry} from "../types"
import { v1 as uuid } from "uuid"

const getAllPatients = ():  PatientEntry[] => {
    return data
}

const getNonSensitiveData = (): NonSensitiveEntry[] => {
    return data.map(({ id, name, dateOfBirth, gender, occupation, entries}) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
        entries
    }))
}

const addPatient = (entry: NewPatientEntry): PatientEntry => {
    const newPatient = {
        id: uuid(),
        ...entry,
    }
    data.push(newPatient)
    return newPatient
}

const addEntryToPatient = (id: string, newEntry: Entry): PatientEntry | undefined => {
    const patient = data.find(p => p.id === id)
    if (!patient) {
        return undefined
    }

    const entryWithId = { ...newEntry, id: uuid() }
    patient.entries.push(entryWithId)
    return patient
}

const getPatientById = (id: string): PatientEntry | undefined => {
    return data.find((patient) => patient.id === id)
}

export default {
    getAllPatients,
    getNonSensitiveData,
    addPatient,
    addEntryToPatient,
    getPatientById,
}