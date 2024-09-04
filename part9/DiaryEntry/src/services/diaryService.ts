import axios from "axios";
import { DiaryEntries, NewDiaryEntry } from "../types"

const baseUrl = "http://localhost:3000/api/diaries"

export const getAllDiaries = () => {
    return axios
    .get<DiaryEntries[]>(baseUrl)
    .then(res => res.data)
}

export const addDiary = (object: NewDiaryEntry) => {
    return axios
    .post<DiaryEntries>(baseUrl, object)
    .then(res => res.data)
    .catch((error) => {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data || "Unknown error occured");
        } else {
            throw new Error("Failed to add diary entry: " + error.message);
        }
    })
}