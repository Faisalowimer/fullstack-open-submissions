const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require("cors")
require("dotenv").config()

const Person = require("./Models/person")

app.use(express.static("dist"))
app.use(express.json())
app.use(cors())

morgan.token("body", (request) => {
  return request.method === "POST"
    ? JSON.stringify(request.body)
    : ""
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === "Casterror") {
    return response.status(400).send( { error: "Malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}


app.get("/info", (request, response) => {
  Person.countDocuments({}).then(count => {
    const infoContent = (
      `
            <p>Phonebook has info for ${count} people</p>
            <p>${new Date()}</p>
            `
    )
    response.send(infoContent)
  })
})

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: "Name is missing"
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: "Number is missing"
    })
  }

  Person.findOne({ name: body.name }).then(existingPerson => {
    if (existingPerson) {
      Person.findByIdAndUpdate(existingPerson._id, { number: body.number }, { new: true })
        .then(updatedPerson => {
          response.json(updatedPerson)
        })
        .catch(error => next(error))
    } else {
      const person = new Person({
        name: body.name,
        number: body.number
      })

      person.save().then(savedPerson => {
        response.json(savedPerson)
      }).catch(error => next(error))
    }
  }).catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`)
})