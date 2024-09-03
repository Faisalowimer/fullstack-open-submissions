import Part from "./Part"

interface CoursePartBase {
    name: string,
    exerciseCount: number,
}

interface CoursePartDescribtion extends CoursePartBase {
    description: string,
}

interface CoursePartBasic extends CoursePartDescribtion {
    kind: "basic"
}
  
interface CoursepartGroup extends CoursePartBase {
    groupProjectCount: number,
    kind: "group"
}
  
interface CoursePartBackground extends CoursePartDescribtion {
    backgroundMaterial: string,
    kind: "background"
}

interface CoursePartSpecial extends CoursePartDescribtion {
    requirements: string[],
    kind: "special",
}

export type CourseParts = 
| CoursePartBasic 
| CoursepartGroup 
| CoursePartBackground 
| CoursePartSpecial

interface ContentProps {
    parts: CourseParts[]
}

const Content = ({ parts }: ContentProps) => {
    return (
        <div>
            {parts.map((part, index) => (
               <Part 
                key={index}
                part={part}
               />
            ))}
        </div>
    )
}

export default Content