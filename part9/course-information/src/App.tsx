import Header from "./components/Header"
import Content from "./components/Content"
import Total from "./components/Total"
import { CourseParts } from "./components/Content"

const App = () => {
  const courseName = "Half Stack application development"
  const courseParts: CourseParts[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic",
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group",
    },
    {
      name: "Basicis of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic",
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background",
    },
    {
      name: "Typescript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic"
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special",
    }
  ]

  const totalExercises = courseParts.reduce((sum, part) => 
    sum + part.exerciseCount, 0)

    return (
      <div>
        <Header 
          name={courseName}
        />
        <Content 
          parts={courseParts}
        />
        <Total 
          exercise={totalExercises}
        />
      </div>
    )
}

export default App