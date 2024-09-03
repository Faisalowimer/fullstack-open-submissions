interface TotalProps {
    exercise: number
}

const Total = (props: TotalProps) => {
    return (
        <>
        <p>
            Number of exercises: {props.exercise}
        </p>
        </>
    )
}

export default Total