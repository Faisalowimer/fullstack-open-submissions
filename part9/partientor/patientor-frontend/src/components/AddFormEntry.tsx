import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { useParams } from "react-router-dom";
import { EntryType } from "../types"


interface EntryFormProps {
    refreshPatientEntries: () => void
}

const AddEntryForm: React.FC<EntryFormProps> = 
({ refreshPatientEntries }) => {
    const { id } = useParams<{ id: string}>()

    const [entryType, setEntryType] = useState<EntryType>("HealthCheck")
    const [description, setDecription] = useState("")
    const [date, setDate] = useState("")
    const [specialist, setSpecialist] = useState("")
    const [healthCheckRating, setHealthCheckRating] = useState("")
    const [diagnosisCodes, setDiagnosisCode] = useState("")
    const [dischargeDate, setDischargeDate] = useState("")
    const [dischargeCriteria, setDischargeCriteria] = useState("")
    const [employerName, setEmployerName] = useState("")
    const [sickLeaveStart, setSickLeaveStart] = useState("")
    const [sickLeaveEnd, setSickLeaveEnd] = useState("")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        let newEntry: any = {
            description,
            date,
            specialist,
            type: entryType,
            diagnosisCodes: diagnosisCodes.split(",").map((code) => code.trim()),
        }

        if (entryType === "HealthCheck") {
            newEntry = { 
                ...newEntry, 
                healthCheckRating: Number(healthCheckRating)
            }
        } else if (entryType === "Hospital") {
            newEntry = {
                ...newEntry,
                discharge: {
                    date: dischargeDate,
                    criteria: dischargeCriteria
                }
            }
        } else if (entryType === "OccupationalHealthcare") {
            newEntry = {
                ...newEntry,
                employerName,
                sickLeave: sickLeaveStart && sickLeaveEnd
                ? { 
                    startDate: sickLeaveStart,
                    endDate: sickLeaveEnd
                }
                : undefined
            }
        }
    
        try {
            await axios.post(`${apiBaseUrl}/patients/${id}/entries`, newEntry)
            refreshPatientEntries()
            resetForm()
            setErrorMessage(null)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setErrorMessage(error.response.data)
            } else {
                setErrorMessage("Something went wrong.")
            }
        }
    }

    const resetForm = () => {
        setDecription("")
        setDate("")
        setSpecialist("")
        setHealthCheckRating("")
        setDiagnosisCode("")
        setDischargeDate("")
        setDischargeCriteria("")
        setEmployerName("")
        setSickLeaveStart("")
        setSickLeaveEnd("")
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
                New Health Entry
            </Typography>
            
            {errorMessage && 
                <Alert severity="error">
                    {errorMessage}
                </Alert>
            }
            
            <form 
                onSubmit={handleFormSubmit}
            >
                <FormControl
                    fullWidth
                    margin="normal"
                >
                    <InputLabel>
                        Entry Type
                    </InputLabel>

                    <br></br>
                    <Select
                        value={entryType}
                        onChange={(e) => 
                            setEntryType(
                                e.target.value as EntryType
                            )
                        }
                        fullWidth
                    >
                        <MenuItem 
                            value="HealthCheck"
                        >
                            Health Check
                        </MenuItem>

                        <MenuItem 
                            value="Hospital"
                        >
                            Hospital
                        </MenuItem>

                        <MenuItem
                            value="OccupationalHealthcare"
                        >
                            Occupational Healthcare
                        </MenuItem>
                    </Select>
                </FormControl>

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
                    label="Diagnosis Codes"
                    fullWidth
                    value={diagnosisCodes}
                    onChange={({ target }) => 
                        setDiagnosisCode(target.value)
                    }
                    margin="normal"
                    placeholder="Comma-separated diagnosis codes"
                />

                {entryType === "HealthCheck" && (
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
                )}

                {entryType === "Hospital" && (
                    <>
                    <TextField
                        label="Discharge Date"
                        fullWidth
                        value={dischargeDate}
                        onChange={({ target }) => 
                            setDischargeDate(target.value)
                        }
                        margin="normal"
                        placeholder="YYYY-MM-DD"
                    />

                    <TextField 
                        label="Discharge Criteria"
                        fullWidth
                        value={dischargeCriteria}
                        onChange={({ target }) => 
                            setDischargeCriteria(target.value)
                        }
                        margin="normal"
                    />
                    </>
                )}
                
                {entryType === "OccupationalHealthcare" && (
                    <>
                    <TextField 
                        label="Employer Name"
                        fullWidth
                        value={employerName}
                        onChange={({ target }) => {
                            setEmployerName(target.value)
                        }}
                        margin="normal"
                    />

                    <TextField 
                        label="Sick Leave Start"
                        fullWidth
                        value={sickLeaveStart}
                        onChange={({ target }) => {
                            setSickLeaveStart(target.value)
                        }}
                        margin="normal"
                        placeholder="YYYY-MM-DD"
                    />


                    <TextField 
                        label="Sick Leave End"
                        fullWidth
                        value={sickLeaveEnd}
                        onChange={({ target }) => {
                            setSickLeaveEnd(target.value)
                        }}
                        margin="normal"
                        placeholder="YYYY-MM-DD"
                    />
                    </>
                )}
                
                <Box 
                    display="flex"
                    justifyContent="space-between"
                    marginTop="1em"
                >
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={resetForm}
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

export default AddEntryForm