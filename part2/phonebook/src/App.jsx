import { useState } from 'react'
import Filter from "./components/Filter.jsx"
import PersonForm from "./components/PersonForm.jsx"
import Persons from "./components/Persons.jsx"

const App = () => {

  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "999-9999999" },
  ])
  const [searchQuery, setSearchQuery] = useState("")

  const addPerson = (newPerson) => {
    persons.some(person => person.name === newPerson.name)
    ? alert(`${newPerson.name} is already added to Phonebook`)
    : setPersons(persons.concat(newPerson))
  }

  const handleSearchChange = (query) => {
    setSearchQuery(query)
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return(
    <>
      <h2>Phonebook</h2>
      <Filter 
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
      />
      <h2>Add a new</h2>
      <PersonForm 
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <Persons 
        persons={personsToShow}
      />
    </>
  )
}

export default App