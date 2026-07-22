import api from "./api";

export const addBookmark = (data) => {
    return api.post("/bookmarks", data);
};

export const removeBookmark = (id) => {
    return api.delete(`/bookmarks/${id}`);
};

export const getMyBookmarks = (userId) => {
    return api.get(`/bookmarks/user/${userId}`);
};

export const updateBookmarkNote = (id, note) => {
    return api.put(`/bookmarks/${id}/note`, { note });
};