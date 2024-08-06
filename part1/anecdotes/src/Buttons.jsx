import React from "react"

const Buttons = (props) => {
    const { handleClick, text } = props
    return(
            <button onClick={handleClick}>
                {text}
            </button>
    )
}

export default Buttons