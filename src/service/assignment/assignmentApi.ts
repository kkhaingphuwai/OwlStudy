import type { AssignmentFile } from "../../components/store/assignmnet/action";
import api from "../api";

export const assignmentApi = {

    uploadAssignment: async (file: AssignmentFile) => {
        const formData = new FormData();
        formData.append("assignment", file.assignment);
        formData.append("description", file.description);
        formData.append("dueDate", file.dueDate);
        formData.append("title", file.title);
        formData.append("subject", file.subject);
        return api.post("/assignments", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        });
    },

    getAllAssignment: async () => {
        return api.get("/assignments");
    }
}