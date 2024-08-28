import express from "express"
import cors from "cors"

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

app.listen(PORT, () => {
    console.log(`server running on port http://localhost/${PORT}`);
})