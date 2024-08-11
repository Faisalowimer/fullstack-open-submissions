import { useState, useEffect } from 'react'
import Filter from "./components/Filter.jsx"
import PersonForm from "./components/PersonForm.jsx"
import Persons from "./components/Persons.jsx"
import Notification from './components/Notification.jsx'
import phoneServices from './services/phoneServices.js'

const App = () => {

  const [persons, setPersons] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState("success")

  useEffect(() => {
    phoneServices
    .getAll()
    .then(initialPhones => {
      setPersons(initialPhones)
    })
  }, [])

  const addPerson = (newPerson) => {
    const person = persons.find(p => p.name === newPerson.name)
    
    if (person) {
      const updatedContact = {...person, number: newPerson.number}

      if (window.confirm(`${newPerson.name} is already added to Phonebook, replace the old number with a new one?`)) {
      phoneServices
        .update(person.id, updatedContact)
        .then(returnedContact => {
          setPersons(persons.map(p => p.id !== person.id ? p : returnedContact))
          setNotificationMessage(`${newPerson.name} number has been updated.`)
          setNotificationType("success")
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
      })
      .catch(error => {
        setNotificationMessage(
          `Information of ${newPerson.name} has already been removed from server.`
        )
        setNotificationType("error")
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      })
    }
  } else {
    phoneServices
    .create(newPerson)
    .then(returnedContact => {
      setPersons(persons.concat(returnedContact))
      setNotificationMessage(`Added ${newPerson.name} to Phonebook.`)
      setNotificationType("success")
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    })
  }
}

  const deleteButton = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      phoneServices
        .deleteContact(id)
        .then(() => {
          setPersons(persons.filter(conctact => conctact.id !== id))
        })
        .catch(error => {
          setNotificationMessage(
            `Information of ${person.name} has already been removed from server.`
          )
          setNotificationType("error")
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
          setPersons(persons.filter(contact => contact.id !== id))
        })
      }
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
      <Notification 
        message={notificationMessage} 
        type={notificationType}
      />
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
        deleteButton={deleteButton}
      />
    </>
  )
}

export default App