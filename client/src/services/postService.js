import api from "./api";

export const getPosts = () => {
    return api.get("/posts");
};

export const createPost = (data) => {
    return api.post("/posts", data);
};

export const likePost = (id, userId) => {
    return api.put(`/posts/${id}/like`, { userId });
};

export const commentPost = (id, data) => {
    return api.post(`/posts/${id}/comment`, data);
};



export const updatePost = (id, data) => {
    return api.put(`/posts/${id}`, data);
};

export const deletePost = (id) => {
    return api.delete(`/posts/${id}`);
};