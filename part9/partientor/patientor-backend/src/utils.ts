import { NewPatientEntry, Gender, Entry, healthCheckRating, EntryWithoutId,  } from "./types"
import { v1 as uuid } from "uuid"


const isString = (text: unknown): text is string => {
    return typeof text === "string" || text instanceof String
}

const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date))
}

const isGender = (param: unknown): param is Gender => {
    return Object.values(Gender).includes(param as Gender)
}

const parseName = (name: unknown): string => {
    if (!isString(name)) {
        throw new Error("Incorrect or missing name");
    }
    return name
}

const parseDateOfBirth = (date: unknown): string => {
    if (!isString(date) || !isDate(date)) {
        throw new Error("Incorrect or missing date of birth: " + date);
    }
    return date
}

const parseSsn = (ssn: unknown): string => {
    if (!isString(ssn)) {
        throw new Error("Incorrect or missing ssn");
    }
    return ssn
}

const parseGender = (gender: unknown): Gender => {
    if (!isString(gender) || !isGender(gender)) {
        throw new Error("Incorrect or missing gender: " + gender);
    }
    return gender
}

const parseOccupation = (occupation: unknown): string => {
    if (!isString(occupation)) {
        throw new Error("Incorrecent or missing occupation");
    }
    return occupation
}

const isHealthCheckRating = (param: any): param is healthCheckRating => {
    return Object.values(healthCheckRating).includes(param)
}

const parseDiagnosisCodes = (object: unknown): Array<string> => {
    if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
        return [] as Array<string>
    }
    return object.diagnosisCodes as Array<string>
}

const parseBaseEntry = (object: any): Omit<EntryWithoutId, "type"> => {
    return {
        description: parseString(object.description),
        date: parseDate(object.date),
        specialist: parseString(object.specialist),
        diagnosisCodes: parseDiagnosisCodes(object)
    }
}

const parseString = (value: unknown): string => {
    if (!value || !isString(value)) {
        throw new Error("Incorrect or missing string value.");
        
    }
    return value
}

const parseDate = (value: unknown): string => {
    if (!value || !isString(value) || !isDate(value)) {
        throw new Error("Incorrect or missing date value.");
    }
    return value
}

const assertNever = (value: never): never => {
    throw new Error(`Unhaldled discriminated union memeber: ${JSON.stringify(value)}`);
    
}

export const toNewEntry = (object: EntryWithoutId): Entry => {
    const baseEntry = parseBaseEntry(object)

    switch (object.type) {
        case "Hospital":
            if (!object.discharge || !isString(object.discharge.date) || !isString(object.discharge.criteria)) {
                throw new Error("Invalid or missing discharge information.");   
            }
            return {
                ...baseEntry,
                type: "Hospital",
                discharge: {
                    date: parseDate(object.discharge.date),
                    criteria: parseString(object.discharge.criteria),
                },
                id: uuid()
            }
        
            case "OccupationalHealthcare":
                if (!isString(object.employerName)) {
                    throw new Error("Invalid or missing employerName.");
                }
                return {
                    ...baseEntry,
                    type: "OccupationalHealthcare",
                    employerName: object.employerName,
                    sickLeave: object.sickLeave ? {
                        startDate: parseDate(object.sickLeave.startDate),
                        endDate: parseDate(object.sickLeave.endDate),
                    } : undefined,
                    id: uuid()
                }

            case "HealthCheck":
                if (typeof object.healthCheckRating !== "number" || !isHealthCheckRating(object.healthCheckRating)) {
                    throw new Error("Invalid or missing healthCheckRating.");
                }
                return {
                    ...baseEntry,
                    type: "HealthCheck",
                    healthCheckRating: object.healthCheckRating,
                    id: uuid()
                }
    
        default:
            return assertNever(object)
            
    }
}

export const toNewPatientEntry = (object: unknown): NewPatientEntry => {
    if (!object || typeof object !== "object") {
        throw new Error("Incorrect or missing data");
    }

    if ("name" in object && "dateOfBirth" in object 
    && "ssn" in object && "gender" in object 
    && "occupation" in object) {
        const newEntry: NewPatientEntry = {
            name: parseName(object.name),
            dateOfBirth: parseDateOfBirth(object.dateOfBirth),
            ssn: parseSsn(object.ssn),
            gender: parseGender(object.gender),
            occupation: parseOccupation(object.occupation),
            entries: []
        }
        return newEntry
    }
    throw new Error("Incorrect data: some fields are missing");
}

export default toNewPatientEntry