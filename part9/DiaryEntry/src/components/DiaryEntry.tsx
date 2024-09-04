import { DiaryEntries as DiaryEntryType} from "../types"

interface DiaryEntryProps {
    entry: DiaryEntryType
}

const DiaryEntry = ({entry}: DiaryEntryProps) => {
    return(
        <div>
            <h4>{entry.date}</h4>
            <p>Weather: {entry.weather}</p>
            <p>Visibility: {entry.visibility}</p>
            {entry.comment && <p>Comment: {entry.comment}</p>}
        </div>
    )
}

export default DiaryEntry