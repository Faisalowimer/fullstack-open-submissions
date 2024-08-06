import React from "react"

const Part = (props) => {
    return(
        <div>
            <p>
                {props.part1} {props.exercise1}
            </p>
            <p>
                {props.part2} {props.exercise2}
            </p>
            <p>
                {props.part3} {props.exercise3}
            </p> 
        </div>
    )
}


export default Part