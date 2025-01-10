export interface User {
}

export interface Block {
    details: string | null,
    endTime: string | null,
    startTime: string,
    type: ("working" | "traveling" | "lunch" | "other"),
    workingPlace: string
}
