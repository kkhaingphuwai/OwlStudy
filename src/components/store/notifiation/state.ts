import { makeAutoObservable } from "mobx";

export type NotificationType = "MEETING" | "COMMENT";

export interface MeetingNotification {
    id: number;
    detailMessage: string;
    meetingTitle: string;
    scheduledAt: string;
    startTime: string;
    endTime: string;
    senderEmail: string;
    senderName: string;
    type: NotificationType
}

export class NotificationState {

    notifications: MeetingNotification[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setNotifications(notifications: MeetingNotification[]) {
        this.notifications = Array.isArray(notifications) ? notifications : [];
    }

    addNotification(notification: MeetingNotification) {
        this.notifications.unshift(notification);
    }
}