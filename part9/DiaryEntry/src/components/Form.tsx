import React, { useState } from "react";
import { Weather, Visibility, NewDiaryEntry } from "../types";
import { addDiary } from "../services/diaryService";

interface DiaryFormProps {
    DiaryAdded: (newDiary: NewDiaryEntry) => void
}

const Form = ({ DiaryAdded }: DiaryFormProps) => {
    const [date, setDate] = useState("")
    const [weather, setWeather] = useState<Weather>(Weather.Sunny)
    const [visibility, setVisibility] = useState<Visibility>(Visibility.Great)
    const [comment, setComment] = useState("")
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault()

        const newDiary: NewDiaryEntry = {
            date,
            weather,
            visibility,
            comment,
        }

    addDiary(newDiary)    
        .then((addedDiary) => {
            DiaryAdded(addedDiary)
            setDate("")
            setWeather(Weather.Sunny)
            setVisibility(Visibility.Great)
            setComment("")
            setError(null)
        })
        .catch((errorMessage) => {
            setError(errorMessage)
        })
    }
        
    return(
        <form onSubmit={handleSubmit}>
            {error && 
                <p style={{color: "red"}}>
                    {error}
                </p>
            }
            <div>
                <label>Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e)=> setDate(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Weather</label>
                    {Object.values(Weather).map((w) => (
                        <label key={w}>
                            <input 
                                type="radio"
                                value={w}
                                checked={weather === w}
                                onChange={() => setWeather(w)}
                            />
                            {w}
                        </label>
                    ))}
            </div>
            <div>
                <label>Visibility</label>
                    {Object.values(Visibility).map((v) => (
                        <label key={v}>
                            <input 
                                type="radio"
                                value={v}
                                checked={visibility === v}
                                onChange={() => setVisibility(v)}
                            />
                            {v}
                        </label>
                    ))}
            </div>
            <div>
                <label>Comment</label>
                <input 
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>
            <button type="submit">
                Add
            </button>
        </form>
    )
}

export default Form