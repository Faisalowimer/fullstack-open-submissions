import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
    res.send("Hello Full Stack");
});

app.get("/bmi", (req, res) => {
    const { weight, height } = req.query;

    if (!weight || !height || isNaN(Number(weight)) || isNaN(Number(height))) {
        return res.status(400).json({ error: "malformatted parameters" });
    }

    const bmi = calculateBmi(Number(weight), Number(height));
    return res.json({
        weight: Number(weight),
        height: Number(height),
        bmi,
    });
});

app.post("/exercises", (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment , @typescript-eslint/no-explicit-any
    const { daily_exercises, target } = req.body;

    if (!daily_exercises || !target) {
        return res.status(400).json({ error: "Parameters missing." });
    }

    if (!Array.isArray(daily_exercises) || isNaN(Number(target))) {
        return res.status(400).json({ error: "Malformatted parameters." });
    }

    for (const hour of daily_exercises) {
        if (isNaN(Number(hour))) {
            return res.status(400).json({ error: "Malformatted parameters." });
        }
    }

    try {
        const result = calculateExercises(Number(target), daily_exercises.map(Number));
        return res.json({ result });
    } catch (error) {
        return res.status(400).send({
            error: error instanceof Error
            ? error.message
            : "Unknown error"
        });
    }
});

const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});