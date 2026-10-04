import { makeObservable } from "mobx";
import type { StudentState } from "./state";
import { studentApi } from "../../../service/tutor/studentApi";

export class StudentAction {

    private state: StudentState;

    constructor(state: StudentState) {
        this.state = state;
        makeObservable(this);
    }

    getAllUnassignedStudents = async () => {
        this.state.loading = true
        try {
             const response = await studentApi.getAllUnassignedStudent(true);
             this.state.setStudents(response.data.data);
        } catch (error) {
             console.error("Failed to fetch unassigned students", error);
        } finally {
            this.state.loading = false
        }
    }
}