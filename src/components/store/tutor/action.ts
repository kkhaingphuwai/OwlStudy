import { makeObservable } from "mobx";
import { tutorApi } from "../../../service/tutor/tutorApi"
import type { TutorState } from "./state";

export class TutorAction {

    private state: TutorState;

    constructor(state: TutorState) {
        this.state = state;
        makeObservable(this);
    }

    getAllTutorList = async () => {
        this.state.loading = true;
        const response = await tutorApi.getAllTutors();
        this.state.loading = false;
        this.state.setTutors(response.data.data);
    }

    getAssignedStudentsById = async () => {
        try {
            this.state.loading = true;
            const response = await tutorApi.getAssignedStudents();
            this.state.setAssignedStudents(response.data.data);
            this.state.loading = false;
        } catch (error) {
            console.error(error);
        } finally {
            this.state.loading = false;
        }
        
    }
}