import { NotificationAction } from "./action";
import { NotificationState, type MeetingNotification } from "./state";

const state = new NotificationState();
const action = new NotificationAction(state);

export const notificationStore = {
    state,
    getAllNotification: action.getAllNotificaton,
    addNotification: (notification: MeetingNotification) => state.addNotification(notification),
    removeNotification: action.removeNotification,
    handleNotification: action.handleNotification
}