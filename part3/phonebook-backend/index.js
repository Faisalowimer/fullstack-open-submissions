const express = require("express")
const morgan = require("morgan")
const app = express()
const cors = require("cors")

let persons = [
    { 
        "id": "1",
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": "2",
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": "3",
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": "4",
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

app.use(express.json())
app.use(cors())
app.use(express.static("dist"))

morgan.token("body", (request) => {
    return request.method === "POST"
        ? JSON.stringify(request.body)
        : ""
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

app.get("/info", (request, response) => {
    const infoContent = (
        `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
        `
    )
    response.send(infoContent)
})

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    
    response.status(204).end()
})

const generateID = () => {
    return String(Math.floor(Math.random() * 10000))
}

app.post("/api/persons", (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: "name is missing"
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: "number is missing"
        })
    } else if (persons.some(p => p.name === body.name)) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }
    
    const person = {
        id: generateID(),
        name: body.name,
        number: body.number
    }
    
    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
})