import api from "./api";

export const createAssessment = (data) => {
    return api.post("/assessments", data);
};

export const getAssessmentById = (id) => {
    return api.get(`/assessments/${id}`);
};

export const getAssessmentsForCreator = (creatorId) => {
    return api.get(`/assessments/creator/${creatorId}`);
};

export const getAssessmentsForOpportunity = (opportunityId) => {
    return api.get(`/assessments/opportunity/${opportunityId}`);
};

export const submitAssessment = (id, data) => {
    return api.post(`/assessments/${id}/submit`, data);
};

export const getStudentResult = (assessmentId, studentId) => {
    return api.get(
        `/assessments/${assessmentId}/result/${studentId}`
    );
};

export const getAllSubmissions = (assessmentId) => {
    return api.get(
        `/assessments/${assessmentId}/submissions`
    );
};