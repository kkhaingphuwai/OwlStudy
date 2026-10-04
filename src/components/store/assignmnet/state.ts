import { makeAutoObservable } from "mobx";


export interface Assignment {
    id: number,
    title: string,
    description: string,
    dueDate: string,
    uploadBy: string
    subject: string
}

export class AssignmentState {

    title = "";
    description = "";
    dueDate = "";
    file: File | null = null;
    fileName = "";
    loading: boolean = false;
    assignments: Assignment[] = []
    subject: string = ""
    selectedAssignment: Assignment | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setTitle = (value: string) => {
        this.title = value;
    };

    setDescription = (value: string) => {
        this.description = value;
    };

    setDueDate = (value: string) => {
        this.dueDate = value;
    };

    setFile = (file: File | null) => {
        this.file = file;
        this.fileName = file?.name || "";
    };

    setAssignment(assignments: Assignment[]) {
        this.assignments = assignments;
    }

    setSubject = (subject: string) => {
        this.subject = subject;
    };

    setSelectedAssignment = (assignment: any) => {
        this.selectedAssignment = assignment;
    };

    reset = () => {
        this.title = "";
        this.description = "";
        this.dueDate = "";
        this.file = null;
        this.fileName = "";
        this.subject = "";
    };
}