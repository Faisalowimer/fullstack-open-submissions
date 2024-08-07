import React from "react"

const Header = (props) => {
    const { course } = props
    console.log(props)
    return(
        <div>
            <h2>{course}</h2>
        </div>
    )
}

export default Header