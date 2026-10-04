import { makeAutoObservable } from "mobx"

export interface Student {
    id: number,
    email: string,
    fullName: string,
}

export class StudentState {

    students: Student[] = []
    selectedStudent: number[] = [];
    searchText = '';
    loading: boolean = false;
    assignedStudents: Student[] = [];

    constructor() {
        makeAutoObservable(this)
    }

    setStudents(students: Student[]) {
        this.students = students;
    }

    setAssignedStudents(students: Student[]) {
        this.assignedStudents = students;
    }

    toggleStudent(id: number) {
        if (this.selectedStudent.includes(id)) {
            this.selectedStudent = this.selectedStudent.filter(
                (sid) => sid !== id
            );
        } else {
            this.selectedStudent.push(id);
        }
    }

    clearSelectedStudents() {
        this.selectedStudent = [];
    }

    searchStudent(value: string) {
        this.searchText = value;
    }

    get filterStudents() {
        const text = this.searchText.trim().toLocaleLowerCase();
        if (!text) {
            return this.students;
        }
        return this.students.filter(student =>
            student.fullName.toLocaleLowerCase().includes(text)
        )
    }

    removeStudentsByIds(ids: number[]) {
        this.students = this.students.filter(
            (student) => !ids.includes(student.id)
        );
        this.selectedStudent = [];
    }
}