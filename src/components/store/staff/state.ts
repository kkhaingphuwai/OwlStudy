import { makeAutoObservable } from "mobx";

export interface TutorAllocation {
  studentId: number;
  studentName: string;
  studentEmail: string;
  tutorId: number;
  tutorName: string;
  tutorEmail: string;
}

export class StaffState {

    message: string = '';
    loading: boolean = false;
    allocatedList: TutorAllocation[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setMessage(messge: string) {
        this.message = messge
    }

    setLoading(value: boolean) {
        this.loading = value;
    }

    setAllocatedList(allocatedList: TutorAllocation[]) {
        this.allocatedList = allocatedList;
    }
}