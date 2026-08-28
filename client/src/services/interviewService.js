import api from "./api";

export const scheduleInterview = (data) => {
    return api.post("/interviews", data);
};

export const getInterviewById = (id) => {
    return api.get(`/interviews/${id}`);
};

export const getInterviewsForStudent = (studentId) => {
    return api.get(`/interviews/student/${studentId}`);
};

export const getInterviewsForApplication = (applicationId) => {
    return api.get(`/interviews/application/${applicationId}`);
};

export const updateInterviewStatus = (id, status) => {
    return api.put(`/interviews/${id}/status`, { status });
};

export const cancelInterview = (id) => {
    return api.put(`/interviews/${id}/cancel`);
};