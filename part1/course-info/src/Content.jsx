import React from "react"
import Part from "./Part.jsx"

const Content = (props) => {
    const part1 = "Fundamentals of React"
    const exercise1 = 10
    const part2 = "Using props to pass data"
    const exercise2 = 7
    const part3 = "State of a component"
    const exercise3 = 14
    return (
        <div>
        <Part 
            part1={part1} exercise1={exercise1}
        />
        <Part 
            part2={part2} exercise2={exercise2}
        />
        <Part 
            part3={part3} exercise3={exercise3}
        />
        </div>
    )
}

export default Content