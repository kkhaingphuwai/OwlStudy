import { StaffAction } from "./action";
import { StaffState } from "./state";

const state = new StaffState();
const action = new StaffAction(state);

export const staffStore = {
    state,
    bulkAllocateStudents: action.bulkAllocateStudents,
    getAllAllocation: action.getAllAllocation,
    registerStudent: action.registerStudent
}