import { useEffect, useState } from "react"
import { addDiary, getAllDiaries } from "../services/diaryService"
import { DiaryEntries as DiaryEntryType, NewDiaryEntry } from "../types"
import DiaryEntry from "./DiaryEntry"
import Form from "./Form"

const DiaryList = () => {
    const [diaries, setDiaries] = useState<DiaryEntryType[]>([])

    useEffect(() => {
        getAllDiaries()
        .then((data) => {
            setDiaries(data)
        })
        .catch(error => {
            console.log("Failed to fetch diaries", error);
        })
    }, [])

    const handleDiaryAdded = (newDiary: NewDiaryEntry) => {
        addDiary(newDiary).then((addedDiary: DiaryEntryType) => {
            setDiaries((prevDiaries) => prevDiaries.concat(addedDiary))
        })
        .catch(error => {
            console.log("Failed to add new diary entry", error);
        })
    }

    return (
        <div>
            <Form 
                DiaryAdded={handleDiaryAdded}
            />
            <h2>Diary Entries:</h2>
            {diaries.map((diary) => (
                <DiaryEntry
                    key={diary.id}
                    entry={diary}
                />
            ))}
        </div>
    )
}

export default DiaryList