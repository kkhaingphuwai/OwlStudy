import { DocumentAction } from "./action";
import { DocumentState } from "./state";

const state = new DocumentState();
const action = new DocumentAction(state);

export const documentStore = {
    state,
    uploadDocument: action.uploadDocument,
    getDocumentsByStudentId: action.getAllDocumentByStudentId,
    getDocumentsById: action.getAllDocumentById
}