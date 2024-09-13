import data from "../data/diagnoses";
import { Diagnosis } from "../types";

const getAllDiagnosis = (): Diagnosis[] => {
    return data;
};

const addDiagnonsis = () => {
    return null;
};

export default {
    getAllDiagnosis,
    addDiagnonsis,
};