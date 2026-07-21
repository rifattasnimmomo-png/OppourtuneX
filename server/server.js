const postRoutes=require("./routes/postRoutes");
const internshipRoutes=require("./routes/internshipRoutes");
const scholarshipRoutes=require("./routes/scholarshipRoutes");
const applicationRoutes=require("./routes/applicationRoutes");
const express=require("express");
const dotenv=require("dotenv");
const cors=require("cors");
const connectDB=require("./config/db");

dotenv.config();

connectDB();
const userRoutes=require("./routes/userRoutes");

const app=express();
app.use(cors());
app.use(express.json());
app.use("/api/users",userRoutes);
app.use("/api/internships",internshipRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/scholarships",scholarshipRoutes);
app.use("/api/applications",applicationRoutes);

app.get("/",(req,res)=>{
    res.send("Backend is running");
});

const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});