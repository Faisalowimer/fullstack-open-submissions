import React from "react"
import { useState } from "react"
import Buttons from "./Buttons.jsx"
import Stat from "./Stat.jsx"

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const updatedStat = (updatedGood, updatedNeutral, updatedBad) => {
    const updatedTotal = updatedGood + updatedNeutral + updatedBad
    const updatedAverage = updatedTotal > 0 ? (updatedGood - updatedBad) / updatedTotal : 0
    const updatedPositive = updatedTotal > 0 ? (updatedGood / updatedTotal) * 100 : 0

    setTotal(updatedTotal)
    setAverage(updatedAverage)
    setPositive(updatedPositive)
  }

  const handleGoodClick = () => {
    const updatedGood= good + 1

    setGood(updatedGood)
    updatedStat(updatedGood, neutral, bad)
    //console.log("this is good:", updatedGood)
  }

  const handleNeutralClick = () => {
    const updatedNeutral= neutral + 1
    
    setNeutral(updatedNeutral)
    updatedStat(good, updatedNeutral, bad)
    //console.log("this is neutral:", updatedNeutral)
  }

  const handleBadClick = () => {
    const updatedBad= bad + 1
    
    setBad(updatedBad)
    updatedStat(good, neutral, updatedBad)
    //console.log("this is bad:", updatedBad)
  }
  

  return(
    <>
      <h1>Give Feedback</h1>
      <Buttons 
        handleClick={handleGoodClick} 
        text="Good"
      />
      <Buttons 
        handleClick={handleNeutralClick} 
        text="Neutral"
      />
      <Buttons 
        handleClick={handleBadClick} 
        text="Bad"
      />
      <Stat 
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        average={average}
        positive={positive}
      />
    </>
  )
}

export default App