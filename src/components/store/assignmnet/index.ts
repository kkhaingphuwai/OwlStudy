import { AssignmentAction } from "./action";
import { AssignmentState } from "./state";

const state = new AssignmentState();
const action = new AssignmentAction(state);

export const assignmentStroe = {
    state,
    uploadAssignment: action.uploadAssignment,
    getAllAssignment: action.getAllAssigmentList
}