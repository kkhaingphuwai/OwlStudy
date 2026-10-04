import { makeAutoObservable } from "mobx";
import type { AssignmentState } from "./state";
import { assignmentApi } from "../../../service/assignment/assignmentApi";

export interface AssignmentFile {
    assignment: File;
    description: string;
    dueDate: string;
    title: string;
    subject: string;
}

export class AssignmentAction {

    private state: AssignmentState;

    constructor(state: AssignmentState) {
        this.state = state;
        makeAutoObservable(this);
    }

    uploadAssignment = async (fileItem: AssignmentFile) => {
        try {
            this.state.loading = true
            await assignmentApi.uploadAssignment(fileItem);
            this.state.loading = false
        } catch (error) {
            console.log(error)
        } finally {
            this.state.loading = false
        }
    }

    getAllAssigmentList = async () => {
        try {
            this.state.loading = true
            const respone = await assignmentApi.getAllAssignment();
            this.state.setAssignment(respone.data.data);
            this.state.loading = false
        } catch (error) {
            console.log(error)
        } finally {
            this.state.loading = false
        }
    }
}