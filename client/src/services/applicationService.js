import api from "./api";

export const applyForOpportunity = (data) => {
    return api.post("/applications", data);
};

export const getApplicationsForOpportunity = (opportunityId) => {
    return api.get(`/applications/opportunity/${opportunityId}`);
};

export const getMyApplications = (studentId) => {
    return api.get(`/applications/student/${studentId}`);
};

export const updateApplicationStatus = (id, status) => {
    return api.put(`/applications/${id}/status`, { status });
};

export const withdrawApplication = (id) => {
    return api.put(`/applications/${id}/withdraw`);
};