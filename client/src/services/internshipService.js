import api from "./api";

export const getInternships = (filters = {}) => {
    return api.get("/internships", { params: filters });
};

export const getInternship = (id) => {
    return api.get(`/internships/${id}`);
};

export const createInternship = (data) => {
    return api.post("/internships", data);
};

export const updateInternship = (id, data) => {
    return api.put(`/internships/${id}`, data);
};

export const deleteInternship = (id) => {
    return api.delete(`/internships/${id}`);
};