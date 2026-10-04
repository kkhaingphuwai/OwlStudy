import { makeAutoObservable } from "mobx";
import type { ExceptionReportState } from "./state";
import { reportApi } from "../../../service/report/reportApi";

export class ExceptionReportAction {
    
    private state: ExceptionReportState;

    constructor(state: ExceptionReportState) {
        this.state = state;
        makeAutoObservable(this);
    }

    getAllUnAssignedStudent = async () => {
        try {
            this.state.loading = true
            const response = await reportApi.getUnassignedStudents();
            this.state.setUnAssignedStudent(response.data.data);
        } catch (error) {
            console.error(error)
        } finally {
            this.state.loading = false
        }
    }

    getInActiveStudents = async (days: number) => {
        try {
            this.state.loading = true
            const response = await reportApi.getInActiveReport(days);
            this.state.setUnAssignedStudent(response.data.data);
        } catch (error) {
            console.error(error)
        } finally {
            this.state.loading = false
        }
    }

    getAverageNumberByTutor = async () => {
        try {
            this.state.loading = true
            const response = await reportApi.getAverageReport();
            this.state.setAverageTutorMessage(response.data.data);
        } catch (error) {
            console.error(error)
        } finally {
            this.state.loading = false
        }
    }

    getTotalMessageLast7Days = async () => {
        try {
            this.state.loading = true
            const response = await reportApi.getTotalMessageLast7Days();
            console.log('Last 7 days message', response.data.data);
            this.state.setMessageLastDays(response.data.data);
        } catch (error) {
            console.error(error)
        } finally {
            this.state.loading = false
        }
    }

}
