import { ExceptionReportAction } from "./action";
import { ExceptionReportState } from "./state";

const state = new ExceptionReportState();
const action = new ExceptionReportAction(state);

export const reportStore = {
    state,
    getUnassignedStudent: action.getAllUnAssignedStudent,
    getInActiveReport: action.getInActiveStudents,
    getAverageReport: action.getAverageNumberByTutor,
    getTotalMessageLast7Days: action.getTotalMessageLast7Days
}