import api from "./api";

export const getMyActivities = (userId) => {
    return api.get(`/activities/user/${userId}`);
};