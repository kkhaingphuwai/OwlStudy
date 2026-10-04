import { makeAutoObservable } from "mobx";

export interface Attachment {
    id: number;
    description: string;
    uploadTimestamp: string;
    status: string;
    fileName: string;
    type: string;
    subject: "";
    imageUrl: string;
    assignmentId: number;
}

export class DocumentState {

    loading: boolean = false
    message: string = ''
    attachment: Attachment | undefined;
    submissions: Attachment[] = []
    individualSubmissions: Attachment[] = []
    selectedDoc: Attachment | null = null;
    uploadingFile: {
        name: string;
        progress: number;
        status: "idle" | "uploading";
    } | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setMessage(message: string) {
        this.message = message;
    }

    setAttachment(attachment: Attachment) {
        this.attachment = attachment
    }

    setSubmissions(submissions: Attachment[]) {
        this.submissions = submissions;
    }

    setIndividualSubmissions(individualSubmissions: Attachment[]) {
        this.individualSubmissions = individualSubmissions;
    }

    setSelectedDoc(selectedDoc: Attachment | null) {
        this.selectedDoc = selectedDoc;
    }
}
