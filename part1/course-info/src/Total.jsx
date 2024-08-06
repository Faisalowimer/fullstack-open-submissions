import React from "react"

const Total = (props) => {
    return(
        <p>
        Number of exercises {props.exercise1 + props.exercise2 + props.exercise3}
        </p>
    )
}

export default Total