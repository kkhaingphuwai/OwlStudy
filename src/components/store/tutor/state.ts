import { makeAutoObservable } from "mobx"

export interface Tutor {
    id: number,
    fullName: string,
    email: string,
    expertise: string
}

export type AssignedStudent = {
  address: string | null;
  age: number;
  assigned: boolean;
  course: string | null;
  currentTutorId: number | null;
  email: string;
  fullName: string;
  id: number;
  phone: string | null;
  registrationDate: string | null;
  session: string;
};

export class TutorState {

    tutors: Tutor[] = []
    selectedTutor: Tutor | null = null;
    loading: boolean = false;
    assignedStudents: AssignedStudent[] = []

    constructor() {
        makeAutoObservable(this)
    }

    setTutors(tutors: Tutor[]) {
        this.tutors = tutors;
    }

    selectTutor(tutor: Tutor) {
        this.selectedTutor = tutor;
    }

    setAssignedStudents(assignedStudents: AssignedStudent[]) {
        this.assignedStudents = assignedStudents;
    }

    clearSelectedTutor() {
        this.selectedTutor = null;
    }
}