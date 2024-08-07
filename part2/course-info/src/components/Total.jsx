import React from "react"

const Total = (props) => {
    const { result } = props
    console.log(props)

    return(
        <p>
        <strong>Total of {result} exercises</strong>
        </p>
    )
}

export default Total