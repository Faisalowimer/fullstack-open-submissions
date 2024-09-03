export interface Diagnosis {
    code: string
    name: string
    latin?: string
}

export enum Gender {
    Male = "male",
    Female = "female",
    Other = "other",
}

export interface PatientEntry {
    id: string
    name: string
    dateOfBirth: string
    ssn?: string
    gender: Gender
    occupation: string
}

export type NonSensitiveEntry = Omit<PatientEntry, "ssn">

export type NewPatientEntry = Omit<PatientEntry, "id">