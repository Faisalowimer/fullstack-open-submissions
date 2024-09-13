import React from "react";

import { Diagnosis, Entry, HealthCheckRating } from "../types";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { LocalHospital, Work, Favorite, Healing } from "@mui/icons-material";

interface EntryDetailsProps {
    entry: Entry
    diagnoses: Diagnosis[]
}

const assertNever = (value: never): never => {
    throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
}

const HealthCheckIcon: React.FC<{ 
    rating: HealthCheckRating 
}> = ({ rating }) => {
    switch (rating) {
        case HealthCheckRating.Healthy:
            return <Favorite 
                        style={{ color: "green" }} 
                    />
            
        case HealthCheckRating.LowRisk:
            return <Favorite 
                        style={{ color: "yellow" }} 
                    />
        
        case HealthCheckRating.HighRisk:
            return <Favorite 
                        style={{ color: "orange" }} 
                    />

        case HealthCheckRating.CriticalRisk:
            return <Favorite 
                        style={{ color: "red" }}
                    />
        default:
            return null;
    }
}

const getDiagnosisDescription = 
(code: string, diagnoses: Diagnosis[]): string | undefined => {
    const diagnosis = diagnoses.find((d) => d.code === code)
    return diagnosis ? diagnosis.name : undefined
}

const EntryCommonDetails: React.FC<{ 
    description: string; 
    specialist: string; 
    diagnosisCodes?: Array<string> 
    diagnoses: Diagnosis[] 
}> = ({ 
        description, 
        specialist, 
        diagnosisCodes,
        diagnoses
    }) => (
    <>
        <Typography variant="body1">
            {description}
        </Typography>
        
        <Typography variant="body2">
            Diagnose by: {specialist}
        </Typography>
        
        {diagnosisCodes && (
            <Box    
                sx={{ 
                    width: "100%", 
                    marginBottom: "1em" 
                }}
            >
                
                <Typography variant="body2">
                    Diagnosis codes: 
                </Typography>
                
                <ul>
                    {diagnosisCodes.map((code) => (
                        <li key={code}>
                            {code} {getDiagnosisDescription(code, diagnoses)}
                        </li>
                    ))}
                </ul>
            </Box>
        )}
    </>
)

const EntryDetails: React.FC<EntryDetailsProps> = ({ entry, diagnoses }) => {
    switch (entry.type) {
        case "Hospital":
            return (
                <Card 
                    variant="outlined" 
                    style={{ 
                        width: "100%", 
                        marginBottom: "1em" 
                        }}
                    >
                    
                    <CardContent>
                        <Typography variant="h6">
                            {entry.date} <LocalHospital />
                        </Typography>
                        
                        <EntryCommonDetails 
                            description={entry.description}
                            specialist={entry.specialist}
                            diagnosisCodes={entry.diagnosisCodes}
                            diagnoses={diagnoses}
                        />
                        
                        <Typography variant="body2">
                            Discharged on {entry.discharge.date} – {entry.discharge.criteria}
                        </Typography>
                    </CardContent>
                </Card>
            )
            
            case "OccupationalHealthcare":
                return (
                    <Card 
                        variant="outlined" 
                        style={{ 
                            width: "100%", 
                            marginBottom: "1em" 
                            }}
                        >
                        
                        <CardContent>
                            <Typography variant="h6">
                                {entry.date} <Work /> {entry.employerName}
                            </Typography>
                            
                            <EntryCommonDetails 
                                description={entry.description}
                                specialist={entry.specialist}
                                diagnosisCodes={entry.diagnosisCodes}
                                diagnoses={diagnoses}
                            />
                            
                            {entry.sickLeave && (
                                <Typography variant="body2">
                                    Sick Leave: {entry.sickLeave.startDate} to {entry.sickLeave.endDate}
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                )
           
                case "HealthCheck":
                return (
                    <Card 
                        variant="outlined" 
                        style={{ 
                            width: "100%",
                            marginBottom: "1em" 
                            }}
                        >
                        
                        <CardContent>
                            <Typography variant="h6">
                                {entry.date} <Healing />
                            </Typography>
                            
                            <EntryCommonDetails 
                                description={entry.description}
                                specialist={entry.specialist}
                                diagnosisCodes={entry.diagnosisCodes}
                                diagnoses={diagnoses}
                            />
                           
                            <HealthCheckIcon 
                                rating={entry.healthCheckRating}
                            />
                        </CardContent>
                    </Card>
                )

        default:
            return assertNever(entry)
    }
}

export default EntryDetails