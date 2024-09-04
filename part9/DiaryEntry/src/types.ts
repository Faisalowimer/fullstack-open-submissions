export enum Weather {
    Sunny = "sunny",
    Rainy = "rainy",
    Cloudy = "cloudy",
    Windy = "windy",
    Stormy = "stormy"
}

export enum Visibility {
    Great = "great",
    Good = "good",
    Ok = "ok",
    Poor ="poor",
}

export interface DiaryEntries {
    id: number,
    date: string,
    weather: Weather,
    visibility: Visibility,
    comment?: string,
}

export type NewDiaryEntry = Omit<DiaryEntries, "id">