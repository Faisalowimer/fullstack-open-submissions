import React from "react"

const Persons = ({ persons }) => {
    return(
        <ul style={{ listStyleType: "none", padding:0}} >
        {persons.map((person, index) => 
          <li key={index}>{person.name} {person.number}</li>
        )}
      </ul>
    )
}

export default Persons