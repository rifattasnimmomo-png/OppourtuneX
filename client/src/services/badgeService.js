import api from "./api";

export const getMyBadges = (userId) => {
    return api.get(`/badges/user/${userId}`);
};