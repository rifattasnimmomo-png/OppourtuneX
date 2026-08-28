const express = require("express");

const router = express.Router();

const {
    getMyActivities
} = require("../controllers/activityController");

router.get("/user/:userId", getMyActivities);

module.exports = router;