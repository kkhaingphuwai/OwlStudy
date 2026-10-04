import { makeAutoObservable } from "mobx";
import type { DocumentState } from "./state";
import { documentApi } from "../../../service/document/documentApi";

export interface UploadedFile {
    file: File;
    assignmentId: number;
}

export class DocumentAction {
    private state: DocumentState;

    constructor(state: DocumentState) {
        this.state = state;
        makeAutoObservable(this);
    }

    uploadDocument = async (fileItem: UploadedFile) => {
        try {
            if (!fileItem.file || !fileItem.assignmentId) {
                return;
            }
            this.state.loading = true;
            if (this.state.uploadingFile) {
                this.state.uploadingFile.status = "uploading";
            }
            const response = await documentApi.uploadDocument(
                fileItem,
                (percent) => {
                    if (this.state.uploadingFile) {
                        this.state.uploadingFile.progress = percent;
                    }
                }
            );
            this.state.submissions.push(response.data.data);
            this.state.uploadingFile = null;
        } catch (error) {
            console.log(error);
        } finally {
            this.state.loading = false;
        }
    };

    getAllDocumentByStudentId = async (studentId: number, assignmentId: number | undefined) => {
        try {
            const response = await documentApi.getAllDocumentByStudentId(studentId, assignmentId);
            this.state.setSubmissions(response.data.data);
        } catch { }
    };

    getAllDocumentById = async (studentId: number) => {
        try {
            const response = await documentApi.getAllDocumentById(studentId);
            this.state.setIndividualSubmissions(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            
        }
    };
}
