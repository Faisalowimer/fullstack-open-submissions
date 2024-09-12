import data from "../data/patient"
import { PatientEntry, NonSensitiveEntry, NewPatientEntry } from "../types"
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

const getPatientById = (id: string): PatientEntry | undefined => {
    return data.find((patient) => patient.id === id)
}

export default {
    getAllPatients,
    getNonSensitiveData,
    addPatient,
    getPatientById,
}