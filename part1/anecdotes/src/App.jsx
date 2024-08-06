import React from "react"
import { useState } from "react"
import Buttons from "./Buttons.jsx"

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    `The first 90 percent of the code accounts for the first 
  90 percent of the development time...The remaining 10 percent 
  of the code accounts for the other 90 percent of the development time.`,
    `Any fool can write code that a computer can understand. 
  Good programmers write code that humans can understand.`,
    "Premature optimization is the root of all evil.",
    `Debugging is twice as hard as writing the code in the first place. 
  Therefore, if you write the code as cleverly as possible, you are, 
  by definition, not smart enough to debug it.`,
    `Programming without an extremely heavy use of console.log is 
  same as if a doctor would refuse to use x-rays or blood tests 
  when diagnosing patients.`,
    "The only way to go fast, is to go well."
  ]

  const [selected, setSelected] = useState(0)
  const [vote, setVote] = useState(new Array(anecdotes.length).fill(0))

  const handleAnecdoteClick = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    console.log("random num:", randomIndex)
    console.log("random anecdote:", anecdotes[randomIndex])

    setSelected(randomIndex)
  }

  const handleVoteClick = () => {
    const votesCopy = [...vote]
    votesCopy[selected] += 1
    console.log("updated vote:", votesCopy)

    setVote(votesCopy)
  }

  const maxVotes = Math.max(...vote)
  const maxVotesIndex = vote.indexOf(maxVotes)
  const displayMax = (
    <>
      <p>{anecdotes[maxVotesIndex]}</p>
      <p>has {maxVotes} votes</p>
    </>
)

  return(
    <>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {vote[selected]} votes</p>
      <Buttons 
        handleClick={handleVoteClick}
        text="Vote"
      />
      <Buttons 
        handleClick={handleAnecdoteClick}
        text="Next anecdote"
      />
      <h1>Anecdote with most votes</h1>
      {maxVotes > 0 ? (displayMax) : (
        <p>No votes yet...</p>
      )}
    </>
  )
}

export default App