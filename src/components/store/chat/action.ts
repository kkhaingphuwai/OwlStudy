import { makeAutoObservable } from "mobx";
import type { MessageState } from "./state";
import { chatApi } from "../../../service/chat/chatApi";

export class MessageAction {

    private state: MessageState;

    constructor(state: MessageState) {
        this.state = state;
        makeAutoObservable(this);
    }

    getChathistory = async (currentUserId: number, selectedReceiverId: number) => {
        const response = await chatApi.getChathistory(currentUserId, selectedReceiverId);
        this.state.setMessages(response.data.data)
    }

    getChatContacts = async (userId: number) => {
        const response = await chatApi.getChatContact(userId);
        this.state.setMessageContacts(response.data.data);
    }

    getAllStudents = async (name: string) => {
        try {
            const response = await chatApi.getAllStudents(name);
            this.state.setStudents(response.data.data);
        } catch (error) {
            console.error("Failed to fetch unassigned students", error);
        } finally {
            console.log("Failed")
        }
    }

    getAllUnreadMessageCount = async (receiverId: number, senderId: number) => {
        try {
            const response = await chatApi.getUnreadMessageCount(receiverId, senderId);
            console.log('UnRead Count ', response.data.unreadCount);
            this.state.setUnReadCount(response.data.unreadCount);
        } catch (error) {
            console
        } finally {
            console.log("Failed")
        }
    }

    markAllMessageAsRead = async (receiverId: number, senderId: number) => {
        try {
            await chatApi.markMessageAsRead(receiverId, senderId);
        } catch (error) {
            console.log('Mark As Read Error', error)
        } finally {
            console.log("Failed")
        }
    }
}