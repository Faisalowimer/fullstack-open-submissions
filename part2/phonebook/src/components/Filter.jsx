import React from "react"

const Filter = ({ searchQuery, handleSearchChange }) => {
    const handleOnChange = (event) => {
        handleSearchChange(event.target.value)
    }
   
    return(
    <p>
        Filter shown with <input
            value={searchQuery}
            onChange={handleOnChange} 
        />
    </p>
   )
}

export default Filter