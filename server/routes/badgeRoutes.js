const express = require("express");

const router = express.Router();

const {
    getMyBadges
} = require("../controllers/badgeController");

router.get(
    "/user/:userId",
    getMyBadges
);

module.exports = router;