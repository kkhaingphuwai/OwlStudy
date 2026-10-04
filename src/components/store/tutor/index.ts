import { TutorAction } from "./action";
import { TutorState } from "./state"

const state = new TutorState();
const action = new TutorAction(state);

export const tutorStore = {
    state,
    getAllTutors: action.getAllTutorList,
    getAssignedStudentsById: action.getAssignedStudentsById
}