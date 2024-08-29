import data from "../data/diagnoses"
import { Diagnosis } from "../types"

const getAllDiagnosis = (): Diagnosis[] => {
    return data
}

const addEntries = () => {
    return null
}

export default {
    getAllDiagnosis,
    addEntries,
}