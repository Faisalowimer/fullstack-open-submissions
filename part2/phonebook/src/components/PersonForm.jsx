import React from "react"
import { useState } from 'react'

const PersonForm = ({ addPerson }) => {
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")

  const handleNameChange = (event) => {
    setNewName(event.target.value)
    console.log(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
    console.log(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()
    addPerson({ name: newName, number: newNumber }),
    setNewName(""),
    setNewNumber("")
}

    return(
        <form onSubmit={addName} >
        <div>
          Name: <input 
          value={newName}
          onChange={handleNameChange}
          /> 
        </div>
        <div>
          number: <input
          type="number"
          value={newNumber}
          onChange={handleNumberChange} 
          />
        </div>
        <div>
          <button type='submit' >
            add
          </button>
        </div>
      </form>
    )
}

export default PersonForm