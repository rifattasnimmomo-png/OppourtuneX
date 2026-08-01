import api from "./api";

export const getNotifications = (userId) => {
    return api.get(`/notifications/${userId}`);
};

export const getUnreadNotificationCount = (userId) => {
    return api.get(`/notifications/unread-count/${userId}`);
};

export const markNotificationRead = (id) => {
    return api.patch(`/notifications/read/${id}`);
};

export const markAllNotificationsRead = (userId) => {
    return api.patch(`/notifications/read-all/${userId}`);
};
