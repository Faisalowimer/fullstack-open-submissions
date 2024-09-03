import { CourseParts } from "./Content";

const assertNever = (value: never): never => {
    throw new Error(
        `Unhandled discriminated union member: 
        ${JSON.stringify(value)}`
    );
}

const Part = ({ part }: { part: CourseParts }) => {
    const italicStyle = { fontStyle: "italic"}
    const headerStyle = { marginBottom: "0px" }

    switch (part.kind) {
        case "basic":
            return(
                <div>
                    <h3 style={headerStyle}>
                        {part.name} {part.exerciseCount}
                    </h3>
                    <p style={italicStyle}>
                        {part.description}
                    </p>
                </div>
            )
            break;
        case "group":
            return(
                <div>
                    <h3 style={headerStyle}>
                        {part.name} {part.exerciseCount}
                    </h3>
                    <p>
                        project exercises {part.groupProjectCount}
                    </p>
                </div>
            )
            break
        case "background":
            return(
                <div>
                    <h3 style={headerStyle}>
                        {part.name} {part.exerciseCount}
                    </h3>
                    <p style={italicStyle}>
                        {part.description}
                    </p>
                    <p>
                        submit to {part.backgroundMaterial}
                    </p>
                </div>
            )
            break
        case "special":
            return(
                <div>
                    <h3 style={headerStyle}>
                        {part.name} {part.exerciseCount}
                    </h3>
                    <p style={italicStyle}>
                        {part.description}
                    </p>
                    <p style={italicStyle}>
                        required skills: {part.requirements.join(", ")}
                    </p>
                </div>
            )
        default:
            return assertNever(part);
    }
}

export default Part