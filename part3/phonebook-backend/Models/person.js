const mongoose = require("mongoose")

const url = process.env.MONGODB_URL
console.log("connecting to", url)

mongoose.set("strictQuery", false)
mongoose.connect(url)
.then(result => {
    console.log("connected to MongoDB")
})
.catch(error => {
    console.log("error connecting to MongoDB", error.message)
})

const validatePhoneNumber = (number) => {
    return /^\d{3}-\d{3}-\d{4}$/.test(number)
}

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: validatePhoneNumber,
            message: props =>
            `${props.value} is not valid phone number! it should be in 
            this format XXX-XXX-XXXX.`
        }
    },
})

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Person", personSchema)