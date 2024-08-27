import express from "express"
import { calculateBmi } from "./bmiCalculator"

const app = express()

app.get("/hello", (_req, res) => {
    res.send("Hello Full Stack")
})

app.get("/bmi", (req, res) => {
    const { weight, height } = req.query

    if (!weight || !height || isNaN(Number(weight)) || isNaN(Number(height))) {
        return res.status(400).json({ error: "malformatted parameters" })
    }

    const bmi = calculateBmi(Number(weight), Number(height))
    return res.json({
        weight: Number(weight),
        height: Number(height),
        bmi,
    })
})

const PORT = 3005
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})
