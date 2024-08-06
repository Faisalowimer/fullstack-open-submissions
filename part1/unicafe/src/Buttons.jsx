import React from "react"

const Buttons = (props) => {
    //create buttons component and assign an event
    //handler for the useState in App
    
    const { handleClick, text } = props
    return(
            <button onClick={handleClick}>
                {text}
            </button>
    )

}

export default Buttons