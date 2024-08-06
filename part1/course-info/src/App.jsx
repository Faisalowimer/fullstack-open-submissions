import React from "react"
import Header from "./Header.jsx"
import Content from "./Content.jsx"
import Total from "./Total.jsx"


const App = () => {
  const course = {
    name: "Half Stack application development",
    parts:[
      {
      name: "Fundamentals of React",
      exercises: 10
      },
      {
      name: "Using props to pass data",
      exercises: 7
      },
      {
      name: "State of component",
      exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name}/>
      <div>
        {course.parts[0].name} {course.parts[0].exercises}
      </div>
      <div>
        {course.parts[1].name} {course.parts[1].exercises}
      </div>
      <div>
        {course.parts[2].name} {course.parts[2].exercises}
      </div>
      <Total 
        exercise1={course.parts[0].exercises}
        exercise2={course.parts[1].exercises}
        exercise3={course.parts[2].exercises}
      />

    </div>
  )

}

export default App
