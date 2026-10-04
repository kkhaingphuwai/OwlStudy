import { MessageAction } from "./action";
import { MessageState, type Message } from "./state";

const state = new MessageState();
const action = new MessageAction(state);

export const messageStore = {
    state,
    getChatHistory: action.getChathistory,
    getChatContacts: action.getChatContacts,
    getAllStudents: action.getAllStudents,
    getAllUnreadMessage: action.getAllUnreadMessageCount,
    markAsRead: action.markAllMessageAsRead,

    addMessage(newMsg: Message) {
        return state.messages.push(newMsg);
    },

    clearMessages() {
        this.state.messages = [];
    },

    clearStudents() {
        this.state.students = [];
    },
    upsertContact(contact: any) {
        const existing = this.state.messageContacts.find(
            (c) => c.partnerId === contact.partnerId
        );

        if (existing) {
            existing.lastMessage = contact.lastMessage;
        } else {
            this.state.messageContacts.unshift(contact);
        }
    },
    updateLastMessage(email: string, content: string) {
        const contact = this.state.messageContacts.find(c => c.partnerEmail === email);
        if (contact) {
            contact.lastMessage = content;
            // Move to top of list
            this.state.messageContacts = [
                contact,
                ...this.state.messageContacts.filter(c => c.partnerEmail !== email)
            ];
        }
    },

    setUnreadToZero(partnerId: number) {
        this.state.messageContacts = this.state.messageContacts.map(c =>
            c.partnerId === partnerId
                ? { ...c, unreadCount: 0 }
                : c
        );
    },

    incrementUnread(partnerId: number) {
        this.state.messageContacts = this.state.messageContacts.map(c =>
            c.partnerId === partnerId
                ? { ...c, unreadCount: (c.unreadCount || 0) + 1 }
                : c
        );
    }
}