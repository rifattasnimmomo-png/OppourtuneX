import api from "./api";

export const registerUser = (userData) => {
    return api.post("/users/register", userData);
};

export const loginUser = (userData) => {
    return api.post("/users/login", userData);
};

export const getProfile = (id) => {
    return api.get(`/users/${id}`);
};

export const updateProfile = (id, data) => {
    return api.put(`/users/${id}`, data);
};