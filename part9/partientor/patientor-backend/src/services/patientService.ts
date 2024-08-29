import data from "../data/patient"
import { PatientEntry, NonSensitiveEntry } from "../types"

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

const addEntries = () => {
    return null
}

export default {
    getAllPatients,
    getNonSensitiveData,
    addEntries,
}