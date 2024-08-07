import React from "react"
import Header from "./Header.jsx"
import Content from "./Content.jsx"
import Total from "./Total.jsx"

const Course = (props) => {
    const { course, result } = props
    console.log(props);

    return (
        <>
          <h1>Web development curriculum</h1>
          {course.map((course, index) => 
          <div key={course.id} >
            <Header course={course.name}/>
            <Content parts={course.parts} />
            <Total result={result[index]}/>
          </div>
          )}
        </>
      )
}

export default Course