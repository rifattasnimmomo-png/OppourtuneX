const dotenv=require("dotenv");
const bcrypt=require("bcryptjs");
const connectDB=require("./config/db");
const User=require("./models/User");

dotenv.config();

const demoUsers=[
    {
        name:"Rifat Tasnim Momo",
        email:"student@test.com",
        password:"Test@123",
        role:"student",
        department:"Computer Science",
        universityName:"OppourtuneX University",
        bio:"Interested in internships, scholarships, and resume building."
    },
    {
        name:"CodeCraft Ltd",
        email:"company@test.com",
        password:"Test@123",
        role:"company",
        companyName:"CodeCraft Ltd",
        bio:"Hiring for software engineering and product roles."
    },
    {
        name:"Bright Future University",
        email:"university@test.com",
        password:"Test@123",
        role:"university",
        universityName:"Bright Future University",
        bio:"University admissions and scholarship support desk."
    },
    {
        name:"Career Support Admin",
        email:"admin@test.com",
        password:"Test@123",
        role:"admin",
        bio:"Platform support and user assistance."
    }
];

const runSeed=async()=>{
    try{
        await connectDB();

        for(const demoUser of demoUsers){
            const existing=await User.findOne({email:demoUser.email});

            if(!existing){
                const hashedPassword=await bcrypt.hash(demoUser.password,10);
                await User.create({
                    name:demoUser.name,
                    email:demoUser.email,
                    password:hashedPassword,
                    role:demoUser.role,
                    department:demoUser.department||"",
                    companyName:demoUser.companyName||"",
                    universityName:demoUser.universityName||"",
                    bio:demoUser.bio||""
                });
                console.log(`Created ${demoUser.email}`);
            }
            else{
                console.log(`${demoUser.email} already exists`);
            }
        }

        console.log("Demo users are ready");
        process.exit(0);
    }
    catch(error){
        console.log(error.message);
        process.exit(1);
    }
};

runSeed();
