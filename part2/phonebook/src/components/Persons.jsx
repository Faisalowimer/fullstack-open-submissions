import React from "react"

const Persons = ({ persons, deleteButton }) => {
    return(
        <ul style={{ listStyleType: "none", padding:0}} >
        {persons.map(person => 
          <li key={person.id}>
            {person.name} {person.number} <button onClick={() => deleteButton(person.id)} >
              Delete
            </button>
          </li>
        )}
      </ul>
    )
}

export default Persons