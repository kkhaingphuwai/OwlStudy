import { makeObservable } from "mobx";
import {
    staffApi,
    type TutorAllocationRequest,
} from "../../../service/staff/staffApi";
import type { StaffState } from "./state";

export type Student = {
  firstName: string;
  lastName: string;
  fatherName: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  emergencyContact: string;
  session: string;
  address: string;
  course: string;
  registrationDate: string;
};

export class StaffAction {

    private state: StaffState;

    constructor(state: StaffState) {
        this.state = state;
        makeObservable(this);
    }

    bulkAllocateStudents = async (studentsId: number[], tutorId: number) => {
        const payload: TutorAllocationRequest = { studentsId, tutorId };
        try {
            this.state.loading = true;
            const res = await staffApi.bulkAllocateStudents(payload);
            this.state.setMessage(res.data.message);

            return res;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            this.state.loading = false;
        }
    };

    getAllAllocation = async () => {
        try {
            const res = await staffApi.getAllAllocationList();
            this.state.setAllocatedList(res.data.data);
            console.log('Allocated List', res.data.data);
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            this.state.loading = false;
        }
    };

    registerStudent = async (payload: Student) => {
        try {
            await staffApi.registerStudent(payload);
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            this.state.loading = false;
        }
    };
}
