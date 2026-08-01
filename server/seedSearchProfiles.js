const dotenv=require("dotenv");
const bcrypt=require("bcryptjs");
const mongoose=require("mongoose");
const connectDB=require("./config/db");
const User=require("./models/User");
const Post=require("./models/Post");

dotenv.config();

const demoProfiles=[
    {
        name:"Atlas Tech Careers",
        email:"atlas.tech@test.com",
        password:"Test@123",
        role:"company",
        companyName:"Atlas Tech Careers",
        bio:"Hiring interns and junior engineers for product, backend, and mobile teams."
    },
    {
        name:"NorthStar Digital",
        email:"northstar.digital@test.com",
        password:"Test@123",
        role:"company",
        companyName:"NorthStar Digital",
        bio:"Design, analytics, and full-stack internship circulars posted weekly."
    },
    {
        name:"PulseWorks Labs",
        email:"pulseworks.labs@test.com",
        password:"Test@123",
        role:"company",
        companyName:"PulseWorks Labs",
        bio:"Opening internship circulars for QA, DevOps, and product support."
    },
    {
        name:"Metro City University",
        email:"metro.city.university@test.com",
        password:"Test@123",
        role:"university",
        universityName:"Metro City University",
        bio:"Scholarship circulars, admissions notices, and student service updates."
    },
    {
        name:"Greenfield Institute of Technology",
        email:"greenfield.itech@test.com",
        password:"Test@123",
        role:"university",
        universityName:"Greenfield Institute of Technology",
        bio:"Academic circulars and scholarship announcements for all departments."
    },
    {
        name:"City Horizon University",
        email:"city.horizon.university@test.com",
        password:"Test@123",
        role:"university",
        universityName:"City Horizon University",
        bio:"Student notices, internship circulars, and financial aid updates."
    }
];

const circularPosts=[
    {
        email:"atlas.tech@test.com",
        content:"Circular: Atlas Tech Careers is opening applications for backend and mobile internship cohorts this month."
    },
    {
        email:"northstar.digital@test.com",
        content:"Circular: NorthStar Digital is inviting students for UI/UX and analytics internship interviews next week."
    },
    {
        email:"pulseworks.labs@test.com",
        content:"Circular: PulseWorks Labs has released a new QA and DevOps internship round with hybrid work options."
    },
    {
        email:"metro.city.university@test.com",
        content:"Circular: Metro City University has opened scholarship applications for merit and need-based awards."
    },
    {
        email:"greenfield.itech@test.com",
        content:"Circular: Greenfield Institute of Technology has published admission and scholarship deadlines for the autumn semester."
    },
    {
        email:"city.horizon.university@test.com",
        content:"Circular: City Horizon University has announced a student career fair and internship referral circular."
    }
];

const runSeed=async()=>{
    try{
        await connectDB();

        for(const profile of demoProfiles){
            let user=await User.findOne({email:profile.email});

            if(!user){
                const hashedPassword=await bcrypt.hash(profile.password,10);
                user=await User.create({
                    name:profile.name,
                    email:profile.email,
                    password:hashedPassword,
                    role:profile.role,
                    companyName:profile.companyName||"",
                    universityName:profile.universityName||"",
                    bio:profile.bio||""
                });
            }
            else{
                user.companyName=profile.companyName||user.companyName;
                user.universityName=profile.universityName||user.universityName;
                user.bio=profile.bio||user.bio;
                await user.save();
            }
        }

        const seededProfiles=await User.find({
            email:{$in:demoProfiles.map((profile)=>profile.email)}
        });

        for(const circular of circularPosts){
            const author=seededProfiles.find((profile)=>profile.email===circular.email);

            if(!author){
                continue;
            }

            const existingPost=await Post.findOne({
                author:author._id,
                content:circular.content
            });

            if(!existingPost){
                await Post.create({
                    author:author._id,
                    authorName:author.name,
                    authorRole:author.role,
                    content:circular.content,
                    image:""
                });
            }
        }

        console.log("Search profiles and circular posts seeded");
        process.exit(0);
    }
    catch(error){
        console.log(error.message);
        process.exit(1);
    }
};

runSeed();
