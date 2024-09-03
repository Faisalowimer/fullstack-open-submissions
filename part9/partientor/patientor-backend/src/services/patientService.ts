import data from "../data/patient"
import { PatientEntry, NonSensitiveEntry, NewPatientEntry } from "../types"
import { v1 as uuid } from "uuid"

const getAllPatients = ():  PatientEntry[] => {
    return data
}

const getNonSensitiveData = (): NonSensitiveEntry[] => {
    return data.map(({ id, name, dateOfBirth, gender, occupation}) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation
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

export default {
    getAllPatients,
    getNonSensitiveData,
    addPatient,
}