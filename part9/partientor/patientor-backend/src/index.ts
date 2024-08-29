import express from "express"
import cors from "cors"
import diagnosisRouter from "./routes/diagnosisRouter"
import patientRouter from "./routes/patientRouter"

const app = express()
app.use(cors({
    origin: "http://localhost:5173"
}))
app.use(express.json())

const PORT = 3003

app.get("/api/ping", (_req, res) => {
    console.log("someone pinged me");
    return res.send("pong")
})

app.use("/api/diagnoses", diagnosisRouter)

app.use("/api/patients", patientRouter)

app.listen(PORT, () => {
    console.log(`server running on port http://localhost/${PORT}`);
})