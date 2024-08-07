import React from "react"

const Content = (props) => {
    const { parts } = props
    console.log(props)
    
    return(
        <div>
           {parts.map(part => (
           <p key={part.div} >
            {part.name} {part.exercises}
           </p>
           ))}
        </div>
    )
}

export default Content