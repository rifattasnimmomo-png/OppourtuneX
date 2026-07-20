import api from "./api";

export const getScholarships = (filters = {}) => {
    return api.get("/scholarships", { params: filters });
};

export const getScholarship = (id) => {
    return api.get(`/scholarships/${id}`);
};

export const createScholarship = (data) => {
    return api.post("/scholarships", data);
};

export const updateScholarship = (id, data) => {
    return api.put(`/scholarships/${id}`, data);
};

export const deleteScholarship = (id) => {
    return api.delete(`/scholarships/${id}`);
};