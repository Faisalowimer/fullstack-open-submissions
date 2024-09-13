import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { useParams } from "react-router-dom";


interface EntryFormProps {
    refreshPatientEntries: () => void
}

const HealthCheckEntryForm: React.FC<EntryFormProps> = 
({ refreshPatientEntries }) => {
    const { id } = useParams<{ id: string}>()
    const [description, setDecription] = useState("")
    const [date, setDate] = useState("")
    const [specialist, setSpecialist] = useState("")
    const [healthCheckRating, setHealthCheckRating] = useState("")
    const [diagnosisCodes, setDiagnosisCode] = useState("")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        const newEntry = {
            description,
            date,
            specialist,
            type: "HealthCheck",
            healthCheckRating: Number(healthCheckRating),
            diagnosisCodes: diagnosisCodes.split(",").map((code) => code.trim()),
        }
    
        try {
            await axios.post(`${apiBaseUrl}/patients/${id}/entries`, newEntry)
            refreshPatientEntries()
            setDecription("")
            setDate("")
            setSpecialist("")
            setHealthCheckRating("")
            setDiagnosisCode("")
            setErrorMessage(null)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setErrorMessage(error.response.data)
            } else {
                setErrorMessage("Something went wrong.")
            }
        }
    }

    const handleClear = () => {
        setDecription("")
        setDate("")
        setSpecialist("")
        setHealthCheckRating("")
        setDiagnosisCode("")
        setErrorMessage(null)
    }

    return (
        <Box 
            sx={{ border: "1px dashed grey",
            padding: "1em",
            marginBottom: "1em"
            }}
        >
            <Typography variant="h6">
                New HealthCheck Entry
            </Typography>
            
            {errorMessage && 
                <Alert severity="error">
                    {errorMessage}
                </Alert>
            }
            
            <form 
                onSubmit={handleFormSubmit}
            >
                <TextField 
                    label="Description"
                    fullWidth
                    value={description}
                    onChange={({ target }) => 
                        setDecription(target.value)
                    }
                    margin="normal"
                />
                
                <TextField 
                    label="Date"
                    fullWidth
                    value={date}
                    onChange={({ target }) => 
                        setDate(target.value)
                    }
                    margin="normal"
                    placeholder="YYYY-MM-DD"
                />
                
                <TextField 
                    label="Specialist"
                    fullWidth
                    value={specialist}
                    onChange={({ target }) => 
                        setSpecialist(target.value)
                    }
                    margin="normal"
                />
                
                <TextField
                    label="HealthCheck Rating"
                    fullWidth
                    value={healthCheckRating}
                    onChange={({ target }) => 
                        setHealthCheckRating(target.value)
                    }
                    margin="normal"
                    placeholder="0 to 3"
                />
                
                <TextField 
                    label="Diagnosis Codes"
                    fullWidth
                    value={diagnosisCodes}
                    onChange={({ target }) => 
                        setDiagnosisCode(target.value)
                    }
                    margin="normal"
                    placeholder="Comma-separated diagnosis codes"
                />
                
                <Box 
                    display="flex"
                    justifyContent="space-between"
                    marginTop="1em"
                >
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={handleClear}
                    >
                        Clear
                    </Button>
                    
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                    >
                        Add
                    </Button>
                </Box>
            </form>
        </Box>
    )
}

export default HealthCheckEntryForm