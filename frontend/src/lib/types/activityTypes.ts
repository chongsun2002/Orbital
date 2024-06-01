export interface CreateActivityDetails {
    title: string,
    description?: string,
    date: {
        from: Date,
        to: Date
    },
    startTime: string,
    endTime: string,
    numOfParticipants: number
    category: string,
    location: string
}

export interface CreatedActivityDetails {
    activityId: string
}

export interface UpdateActivityDetails {
    title?: string,
    description?: string,
    date?: {
        from?: Date,
        to?: Date
    },
    startTime?: string,
    endTime?: string,
    numOfParticipants?: number
    category?: string
    location?: string
}

export interface Activity {
    id: string,
    title: string,
    description?: string,
    startTime: string,
    endTime: string,
    organiserId: string,
    numOfParticipants: string,
    category: string,
    location: string
}

export interface SearchedActivity extends Activity {
    organiser: {
        name: string
    }
}

export interface EnrolledList {
    enrolledNames: string[]
}