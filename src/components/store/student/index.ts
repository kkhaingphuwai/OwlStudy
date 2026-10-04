import { StudentAction } from "./action";
import { StudentState } from "./state";

const state = new StudentState();
const action = new StudentAction(state);

export const studentStore = {
    state,
    getAllUnassignedStudents: action.getAllUnassignedStudents,
}