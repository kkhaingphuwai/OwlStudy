import { makeAutoObservable } from "mobx";

export type Student = {
  id: number;
  fullName: string;
  currentTutorId: number | null;
  assigned: boolean;
  email: string;
  age: number;
  session: string;
  phone: string;
  address: string;
  status: string;
  course: string;
  registrationDate: string;
};

export type TutorMessageAverage = {
  tutorId: number;
  tutorName: string;
  totalMessages: number;
  uniqueContacts: number;
  averageMessagesPerContact: number;
};

export type MessageLast7Days = {
  day: string;
  date: string;
  count: number;
};

export class ExceptionReportState {

    reportType: string = ""
    inactiveRange: string = ""
    unAssignedStudent: Student[] = []
    averageTutorMessage: TutorMessageAverage[] = []
    messageLastDays: MessageLast7Days[] = []
    loading: boolean = false

    constructor() {
        makeAutoObservable(this);
    }

    setReportType(reportType: string) {
        this.reportType = reportType;
    }

    setInActiveRange(inactiveRange: string) {
        this.inactiveRange = inactiveRange;
    }

    setUnAssignedStudent(unAssignedStudent: Student[]) {
        this.unAssignedStudent = unAssignedStudent;
    }

    setAverageTutorMessage(averageTutorMessage: TutorMessageAverage[]) {
        this.averageTutorMessage = averageTutorMessage;
    }

    setMessageLastDays(messageLastDays: MessageLast7Days[]) {
        this.messageLastDays = messageLastDays;
    }

    setLoading(loading: boolean) {
        this.loading = loading
    }
}