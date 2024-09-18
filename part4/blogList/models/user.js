const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  passwordHash: {
    type: String,
    required: true,
  },
  blogs: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog"
    }
  ]
})

// Customize the toJSON method to hide the passwordHash field
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // Do not reveal the passwordHash
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model("User", userSchema)