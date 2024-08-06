import React from "react"

const StatLine = (props) => {
    const { label, value } = props
    return(
        <tr>
            <td>{label}:</td> 
            <td>{value}</td>
        </tr>
    )
}

const Stat = (props) => {
    const { good, neutral, bad, total, average, positive} = props
    return(
        <>
            <h1>Statistics</h1>
            {total === 0 ? (<p>No feedback given</p>)
            : (
                <>
                    <table>
                        <tbody>
                            <StatLine label= "Good" value= {good}/>
                            <StatLine label= "Neutral" value= {neutral}/>
                            <StatLine label= "Bad" value= {bad}/>
                            <StatLine label= "Total" value= {total}/>
                            <StatLine label= "Average" value= {average.toFixed(1)}/>
                            <StatLine label= "Positive" value= {positive.toFixed(1)}/>
                        </tbody>
                    </table>
                </>
            )}
        </>
    )
}

export default Stat