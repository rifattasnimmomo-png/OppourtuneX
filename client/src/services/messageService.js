import api from "./api";

export const searchUsers = (query, currentUserId) => {
    return api.get("/users/search", {
        params: {
            query,
            currentUserId
        }
    });
};

export const getContacts = (userId) => {
    return api.get(`/messages/contacts/${userId}`);
};

export const getConversation = (userId, otherUserId) => {
    return api.get(`/messages/conversation/${userId}/${otherUserId}`);
};

export const getUnreadMessageCount = (userId) => {
    return api.get(`/messages/unread-count/${userId}`);
};

export const sendMessage = (data) => {
    return api.post("/messages", data);
};

export const markConversationRead = (data) => {
    return api.patch("/messages/read", data);
};

export const deleteMessage = (messageId, userId) => {
    return api.delete(`/messages/${messageId}`, {
        data: {
            userId
        }
    });
};
