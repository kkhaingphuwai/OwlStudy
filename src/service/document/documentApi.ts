import type { UploadedFile } from "../../components/store/document/action";
import api from "../api";

export const documentApi = {
  uploadDocument: async (
    file: UploadedFile,
    onProgress?: (percent: number) => void
  ) => {
    const formData = new FormData();

    formData.append("file", file.file);
    formData.append("assignmentId", String(file.assignmentId));

    return api.post("/submissions", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true,
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        onProgress?.(percent);
      }
    });
  },

  getAllDocumentByStudentId: async (studentId: number, assignmentId: number | undefined) => {
    return api.get(`/submissions?studentId=${studentId}&assignmentId=${assignmentId}`);
  },

  getAllDocumentById: async (studentId: number) => {
    return api.get(`/submissions/individual?studentId=${studentId}`);
  }
  
};