import { makeAutoObservable } from "mobx";
import { notificationApi } from "../../../service/notification/notificationApi";
import type { NotificationState } from "./state";

export class NotificationAction {

    private state: NotificationState;

    constructor(state: NotificationState) {
        this.state = state;
        makeAutoObservable(this);
    }

    getAllNotificaton = async () => {
            try {
                const response = await notificationApi.getAllNotification();
                this.state.setNotifications(response.data.data);
            } catch (err) {
                console.error(err);
                throw err;
            } finally {
                // this.state.loading = false;
            }
    };

    handleNotification = async (id: number) => {
        await notificationApi.handleNotification(id);
        this.state.notifications = this.state.notifications.filter(n => n.id !== id);
    }
    
    removeNotification(id: number) {
        this.state.notifications = this.state.notifications.filter(n => n.id !== id);
    }
}