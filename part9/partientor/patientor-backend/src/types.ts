export interface Diagnosis {
    code: string
    name: string
    latin?: string
}

export type Patient = "id" | "name" | "dateOfBirth" | "ssn" | "gender" | "occupation"

export interface PatientEntry {
    id: string
    name: string
    dateOfBirth: string
    ssn?: string
    gender: string
    occupation: string
}

export type NonSensitiveEntry = Omit<PatientEntry, "ssn">