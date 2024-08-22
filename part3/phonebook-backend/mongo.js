const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log("give password as argument")
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://faisal:${password}@cluster0.zmmf7.mongodb.net/Person?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set("strictQuery", false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model("Person", contactSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    
    const contact = new Person({
        name: name,
        number: number,
    })
    
    contact.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}
