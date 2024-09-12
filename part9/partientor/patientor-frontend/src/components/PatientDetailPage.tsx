import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, List, Typography } from "@mui/material";
import { Male, Female, Transgender } from "@mui/icons-material";

import { Gender, Patient, Entry, Diagnosis } from "../types";
import { apiBaseUrl } from "../constants";
import EntryDetails from "./EntryDetails";

interface PatientDetailPageProps {
    diagnoses: Diagnosis[]
}

const PatientDetailPage = ({ diagnoses }: PatientDetailPageProps) => {
    const { id } = useParams<{ id: string}>()
    const [patient, setPatient] = useState<Patient | null>(null)

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const { data: patientData } = 
                await axios.get<Patient>
                (`${apiBaseUrl}/patients/${id}`)
                setPatient(patientData)
            } catch (error) {
                console.log("Failed to fetch patient", error);
            }
        }

        void fetchPatient()
    }, [id])

    const getGenderIcon = (gender: Gender) => {
        switch (gender) {
            case Gender.Male:
                return <Male />
            case Gender.Female:
                return <Female />
            case Gender.Other:
                return <Transgender />
            default:
                return null
        }
    }

    if (!patient) {
        return (<p>Loading patient details...</p>)
    }

    return (
        <div>
            <br></br>
            <Typography variant="h4">
                {patient.name} {getGenderIcon(patient.gender)}
            </Typography>
            <br></br>
            <Typography variant="body1">
                ssn: {patient.ssn}
            </Typography>
            <Typography variant="body1">
                occupation: {patient.occupation}
            </Typography>
            <Box 
                mt={4} 
                sx={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "1em", 
                    alignItem: "center" 
                }}
            >
                <Typography variant="h5">
                    Entries
                </Typography>
                <List sx={{ width: "100%"}}>
                    {patient.entries.map((entry: Entry) => (
                        <EntryDetails 
                            key={entry.id}
                            entry={entry}
                            diagnoses={diagnoses}
                        />
                    ))}
                </List>
            </Box>
        </div>
    )
}

export default PatientDetailPage