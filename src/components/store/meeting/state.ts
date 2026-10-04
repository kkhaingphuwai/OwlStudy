import { makeAutoObservable } from "mobx";
import type { ArrangeMeetingSchedulePayload, MeetingNoteRequest, MeetingType } from "../../../service/meeting/meetingApi";
import { calculateDuration } from "./function";

interface CalendarEvent {
    id: string;
    title: string;
    time: string;
    duration: string;
    notes: string;
    sessionColor?: string;
}

interface EventMap {
    [dateKey: string]: CalendarEvent[];
}

export interface MeetingSchedule {
    id: number;
    meetingTitle: string;
    description: string;
    scheduledAt: string;
    startTime: string;
    endTime: string;
    meetingType: "VIRTUAL" | "PHYSICAL";
    tutorId: number;
    students: any[];
    location?: string;
    virtualPlatform?: string;
    virtualPlatformLink?: string;
    sessionColor: string
}

export type SessionNote = {
    id: number,
    sessionNote: string
}

const todayStr = new Date().toISOString().split("T")[0];

export class MeetingState {
    meetingTitle: string = "";
    scheduledAt = todayStr;
    startTime: string = "";
    endTime: string = "";
    tutorEmail: string = "";
    studentEmail: string[] = [];
    meetingType: MeetingType = "IN_PERSON";
    sessionColor = "";
    description = "";
    location = "";
    virtualPlatform = "";
    virtualPlatformLink = "";
    message: string = "";
    loading: boolean = false;
    meetingSchedules: MeetingSchedule[] = []
    suggestion: string[] = [] 
    note: string = "";
    sessionNote: SessionNote | null = null;

    constructor() {
        makeAutoObservable(this);
        this.scheduledAt = todayStr; 
    }

    setMessage(messge: string) {
        this.message = messge;
    }

    setLoading(value: boolean) {
        this.loading = value;
    }

    setMeetingSchedules(meetingSchedules: MeetingSchedule[]) {
        this.meetingSchedules = meetingSchedules
    }

    setField<K extends keyof MeetingState>(key: K, value: MeetingState[K]) {
        (this as MeetingState)[key] = value;
    }

    setSuggestion(suggestion: string[]) {
        this.suggestion = suggestion;
    }

    setNote(note: string) {
        this.note = note;
    }

    setSessionNote(sessionNote: SessionNote) {
        this.sessionNote = sessionNote
    }

    resetForm() {
        this.meetingTitle = "";
        this.scheduledAt = "";
        this.startTime = "";
        this.endTime = "";
        this.tutorEmail = "";
        this.studentEmail = [];
        this.meetingType = "IN_PERSON";
        this.sessionColor = "";
        this.description = "";
        this.location = "",
        this.virtualPlatform = "",
        this.virtualPlatformLink = ""
    }

    createMeetingPayload(): ArrangeMeetingSchedulePayload {
        return {
            meetingTitle: this.meetingTitle,
            scheduledAt: this.scheduledAt || todayStr,
            startTime: this.startTime,
            endTime: this.endTime,
            tutorEmail: this.tutorEmail,
            studentEmail: this.studentEmail,
            meetingType: this.meetingType,
            sessionColor: this.sessionColor,
            description: this.description,
            location: this.location,
            virtualPlatform: this.virtualPlatform,
            virtualPlatformLink: this.virtualPlatformLink
        }
    }

    createSaveNotePayload (id: number): MeetingNoteRequest {
        return {
            id: id,
            note: this.note || ""
        }
    }

    get calendarEventMap(): EventMap {
        const map: EventMap = {};

        this.meetingSchedules.forEach(m => {
            const date = new Date(m.scheduledAt);

            const key = `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

            if (!map[key]) {
                map[key] = [];
            }

            map[key].push({
                id: String(m.id),
                title: m.meetingTitle,
                time: m.startTime.slice(0, 5),
                duration: calculateDuration(m.startTime, m.endTime),
                notes: m.description ?? "",
                sessionColor: m.sessionColor ?? "indigo",
            });
        });

        return map;
    }
}
