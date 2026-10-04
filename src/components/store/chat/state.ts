import { makeAutoObservable } from "mobx"

export interface MessageContacts {
    partnerName: string;
    partnerId: number;
    lastMessage: string;
    timestamp?: string;
    partnerFirstName: string;
    partnerLastName: string;
    partnerEmail: string;
    unreadCount: number;
}

export interface Message {
    senderEmail: string;
    receiverEmail: string;
    content: string;
    timestamp: string;
}

export interface Student {
    id: number,
    fullName: string,
    email: string
}

export class MessageState {
    messages: Message[] = []
    messageContacts: MessageContacts[] = [] 
    students: Student[] = []
    unReadCount: number = 0;

    constructor() {
        makeAutoObservable(this);
    }

    setMessages(messages: Message[]) {
        this.messages = messages
    }

    setMessageContacts(messageContacts: MessageContacts[]) {
        this.messageContacts = messageContacts
    }

    setStudents(students: Student[]) {
        this.students = students
    }

    setUnReadCount(unReadCount: number) {
        this.unReadCount = unReadCount;
    }
}