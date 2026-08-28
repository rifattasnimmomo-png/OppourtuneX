const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const internshipRoutes = require("./routes/internshipRoutes");
const scholarshipRoutes = require("./routes/scholarshipRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const postRoutes = require("./routes/postRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const activityRoutes = require("./routes/activityRoutes");
const badgeRoutes = require("./routes/badgeRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/scholarships", scholarshipRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/badges", badgeRoutes);

console.log("Post routes loaded");
console.log("Assessment routes loaded");
console.log("Badge routes loaded");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});