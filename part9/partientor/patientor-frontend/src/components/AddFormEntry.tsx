import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert, 
    MenuItem, Select, InputLabel, FormControl, 
    Slider, Checkbox, ListItemText
} from "@mui/material";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { useParams } from "react-router-dom";
import { EntryType, Diagnosis } from "../types";


interface EntryFormProps {
    refreshPatientEntries: () => void
    diagnoses: Diagnosis[]
}

const AddEntryForm: React.FC<EntryFormProps> = 
({ refreshPatientEntries, diagnoses }) => {
    const { id } = useParams<{ id: string}>();

    const [entryType, setEntryType] = useState<EntryType>("HealthCheck");
    const [description, setDecription] = useState("");
    const [date, setDate] = useState("");
    const [specialist, setSpecialist] = useState("");
    const [healthCheckRating, setHealthCheckRating] = useState<number>(0);
    const [diagnosisCodes, setDiagnosisCode] = useState<string[]>([]);
    const [dischargeDate, setDischargeDate] = useState("");
    const [dischargeCriteria, setDischargeCriteria] = useState("");
    const [employerName, setEmployerName] = useState("");
    const [sickLeaveStart, setSickLeaveStart] = useState("");
    const [sickLeaveEnd, setSickLeaveEnd] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        let newEntry: any = {
            description,
            date,
            specialist,
            type: entryType,
            diagnosisCodes,
        };

        if (entryType === "HealthCheck") {
            newEntry = { 
                ...newEntry, 
                healthCheckRating: Number(healthCheckRating)
            };
        } else if (entryType === "Hospital") {
            newEntry = {
                ...newEntry,
                discharge: {
                    date: dischargeDate,
                    criteria: dischargeCriteria
                }
            };
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
            };
        }
    
        try {
            await axios.post(`${apiBaseUrl}/patients/${id}/entries`, newEntry);
            refreshPatientEntries();
            resetForm();
            setErrorMessage(null);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage("Something went wrong.");
            }
        }
    };

    const resetForm = () => {
        setDecription("");
        setDate("");
        setSpecialist("");
        setHealthCheckRating(0);
        setDiagnosisCode([]);
        setDischargeDate("");
        setDischargeCriteria("");
        setEmployerName("");
        setSickLeaveStart("");
        setSickLeaveEnd("");
        setErrorMessage(null);
    };

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
                    type="date"
                    InputLabelProps={{ shrink: true}}
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
                
                <FormControl
                    fullWidth
                    margin="normal"
                >
                    <InputLabel>
                        Diagnosis Codes
                    </InputLabel>

                    <br></br>
                    <Select
                        multiple
                        value={diagnosisCodes}
                        onChange={({ target }) => 
                        setDiagnosisCode(
                            typeof target.value === "string"
                            ? target.value.split(", ")
                            : target.value as string[]
                        )}
                        renderValue={(selected) => selected.join(", ")}
                    >
                        {diagnoses.map((diagnosis) => (
                            <MenuItem
                                key={diagnosis.code}
                                value={diagnosis.code}
                            >
                                <Checkbox
                                    checked={diagnosisCodes.indexOf(diagnosis.code) > -1}
                                />
                                <ListItemText
                                    primary={`${diagnosis.code}: ${diagnosis.name}`}
                                />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {entryType === "HealthCheck" && (
                    <Box
                        sx={{ margin: "normal"}}
                    >
                        <Typography
                            gutterBottom
                        >
                            Health Check Rating
                        </Typography>

                        <Slider
                            value={healthCheckRating}
                            onChange={(_e, newValue) => 
                                setHealthCheckRating(newValue as number)
                            }
                            aria-labelledby="health-check-rating"
                            step={1}
                            marks
                            min={0}
                            max={3}

                        />
                    </Box>
                    
                )}

                {entryType === "Hospital" && (
                    <>
                    <TextField
                        label="Discharge Date"
                        fullWidth
                        type="date"
                        InputLabelProps={{ shrink: true}}
                        value={dischargeDate}
                        onChange={({ target }) => 
                            setDischargeDate(target.value)
                        }
                        margin="normal"
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
                            setEmployerName(target.value);
                        }}
                        margin="normal"
                    />

                    <TextField 
                        label="Sick Leave Start"
                        fullWidth
                        type="date"
                        InputLabelProps={{ shrink: true}}
                        value={sickLeaveStart}
                        onChange={({ target }) => {
                            setSickLeaveStart(target.value);
                        }}
                        margin="normal"
                    />


                    <TextField 
                        label="Sick Leave End"
                        fullWidth
                        type="date"
                        InputLabelProps={{ shrink: true}}
                        value={sickLeaveEnd}
                        onChange={({ target }) => {
                            setSickLeaveEnd(target.value);
                        }}
                        margin="normal"
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
    );
};

export default AddEntryForm;