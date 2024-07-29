export type SearchedUserDetails = {
    id: string;
    name: string;
    image?: string;
    bio?: string;
    birthday?: Date;
    timetableUrl?: string;
}

export type Notification = {
    id: string;
    userId: string;
    notificationType: string;
    additionalContentId: string | null;
    associatedItem?: string;
    content: string | null;
    modifiedAt: Date;
    createdAt: Date;
    seen: boolean;
}