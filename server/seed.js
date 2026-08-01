const dotenv=require("dotenv");
<<<<<<< HEAD
const connectDB=require("./config/db");
const Internship=require("./models/Internship");
const Scholarship=require("./models/Scholarship");
=======
const mongoose=require("mongoose");
const connectDB=require("./config/db");
const Internship=require("./models/Internship");
const Scholarship=require("./models/Scholarship");
const Post=require("./models/Post");
const User=require("./models/User");
const bcrypt=require("bcryptjs");
>>>>>>> 66821a5 (Add updated opportunity calendar feature)

dotenv.config();

const internships=[
    {
        title:"Backend Developer Intern",
        company:"CodeCraft Ltd",
        description:"Build and maintain REST APIs using Node.js and Express for our core product.",
        location:"Dhaka",
        workType:"Onsite",
        stipend:12000,
        duration:"4 months",
        deadline:new Date("2026-09-15"),
        skills:["Node.js","Express","MongoDB"]
    },
    {
        title:"UI/UX Design Intern",
        company:"Pixel Forge Studios",
        description:"Design user interfaces and prototypes for mobile and web products.",
        location:"Chittagong",
        workType:"Hybrid",
        stipend:10000,
        duration:"3 months",
        deadline:new Date("2026-08-30"),
        skills:["Figma","Adobe XD","Prototyping"]
    },
    {
        title:"Data Analyst Intern",
        company:"InsightWorks",
        description:"Analyze business data and build dashboards to support decision-making.",
        location:"Remote",
        workType:"Remote",
        stipend:18000,
        duration:"6 months",
        deadline:new Date("2026-10-01"),
        skills:["Python","SQL","Excel"]
    },
    {
        title:"Mobile App Developer Intern",
        company:"AppNest Bangladesh",
        description:"Develop features for our Flutter-based cross-platform mobile app.",
        location:"Dhaka",
        workType:"Onsite",
        stipend:14000,
        duration:"3 months",
        deadline:new Date("2026-09-01"),
        skills:["Flutter","Dart","Firebase"]
    },
    {
        title:"DevOps Intern",
        company:"CloudBridge Technologies",
        description:"Support our CI/CD pipelines and cloud infrastructure on AWS.",
        location:"Remote",
        workType:"Remote",
        stipend:20000,
        duration:"4 months",
        deadline:new Date("2026-11-15"),
        skills:["Docker","AWS","CI/CD"]
    },
    {
        title:"Marketing & Growth Intern",
        company:"Bright Solutions",
        description:"Assist in running SEO and social media campaigns for client brands.",
        location:"Sylhet",
        workType:"Hybrid",
        stipend:8000,
        duration:"2 months",
        deadline:new Date("2026-08-20"),
        skills:["SEO","Content Writing","Social Media"]
    },
    {
        title:"QA/Testing Intern",
        company:"NextGen Systems",
        description:"Write and execute test cases, and assist with automated testing setup.",
        location:"Dhaka",
        workType:"Onsite",
        stipend:0,
        duration:"3 months",
        deadline:new Date("2026-09-25"),
        skills:["Manual Testing","Selenium"]
    },
    {
        title:"Machine Learning Intern",
        company:"ByteWave Technologies",
        description:"Work on model training and evaluation for a recommendation system.",
        location:"Remote",
        workType:"Remote",
        stipend:25000,
        duration:"6 months",
        deadline:new Date("2026-12-01"),
        skills:["Python","TensorFlow","Machine Learning"]
    }
];

const scholarships=[
    {
        title:"Dean's List Scholarship",
        university:"North South University",
        description:"Awarded to students with outstanding academic performance.",
        amount:40000,
        deadline:new Date("2026-08-31"),
        eligibility:"CGPA 3.7 or above, 2nd year or higher"
    },
    {
        title:"Need-Based Financial Aid",
        university:"University of Dhaka",
        description:"Financial support for students demonstrating economic need.",
        amount:30000,
        deadline:new Date("2026-09-10"),
        eligibility:"Family income below threshold, financial documents required"
    },
    {
        title:"Women in STEM Scholarship",
        university:"BUET",
        description:"Supporting female students pursuing engineering and CSE degrees.",
        amount:60000,
        deadline:new Date("2026-10-05"),
        eligibility:"Female students in Engineering or CSE programs"
    },
    {
        title:"Sports Excellence Scholarship",
        university:"Independent University Bangladesh",
        description:"Recognizing students who represent the university in sports.",
        amount:25000,
        deadline:new Date("2026-08-25"),
        eligibility:"Active member of a university sports team"
    },
    {
        title:"Research Grant for Undergraduates",
        university:"North South University",
        description:"Funding for undergraduate students working on faculty-supervised research.",
        amount:45000,
        deadline:new Date("2026-11-01"),
        eligibility:"Ongoing research project with a faculty supervisor"
    },
    {
        title:"Freshman Entry Scholarship",
        university:"East West University",
        description:"Welcoming top-performing students straight out of HSC.",
        amount:20000,
        deadline:new Date("2026-09-05"),
        eligibility:"SSC/HSC GPA 5.00, first year students only"
    },
    {
        title:"CSE Talent Scholarship",
        university:"BRAC University",
        description:"Awarded to high-performing students in the CSE department.",
        amount:55000,
        deadline:new Date("2026-10-20"),
        eligibility:"CGPA 3.8 or above in CSE department"
    },
    {
        title:"Community Service Scholarship",
        university:"University of Dhaka",
        description:"Recognizing students with a strong record of community service.",
        amount:15000,
        deadline:new Date("2026-08-15"),
        eligibility:"100+ hours of verified community service"
    }
];

<<<<<<< HEAD
=======
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

const demoProfiles=[
    {
        _id:new mongoose.Types.ObjectId("66a100000000000000000001"),
        name:"Atlas Tech Careers",
        email:"atlas.tech@test.com",
        password:"Test@123",
        role:"company",
        companyName:"Atlas Tech Careers",
        bio:"Hiring interns and junior engineers for product, backend, and mobile teams."
    },
    {
        _id:new mongoose.Types.ObjectId("66a100000000000000000002"),
        name:"NorthStar Digital",
        email:"northstar.digital@test.com",
        password:"Test@123",
        role:"company",
        companyName:"NorthStar Digital",
        bio:"Design, analytics, and full-stack internship circulars posted weekly."
    },
    {
        _id:new mongoose.Types.ObjectId("66a100000000000000000003"),
        name:"PulseWorks Labs",
        email:"pulseworks.labs@test.com",
        password:"Test@123",
        role:"company",
        companyName:"PulseWorks Labs",
        bio:"Opening internship circulars for QA, DevOps, and product support."
    },
    {
        _id:new mongoose.Types.ObjectId("66a200000000000000000001"),
        name:"Metro City University",
        email:"metro.city.university@test.com",
        password:"Test@123",
        role:"university",
        universityName:"Metro City University",
        bio:"Scholarship circulars, admissions notices, and student service updates."
    },
    {
        _id:new mongoose.Types.ObjectId("66a200000000000000000002"),
        name:"Greenfield Institute of Technology",
        email:"greenfield.itech@test.com",
        password:"Test@123",
        role:"university",
        universityName:"Greenfield Institute of Technology",
        bio:"Academic circulars and scholarship announcements for all departments."
    },
    {
        _id:new mongoose.Types.ObjectId("66a200000000000000000003"),
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
        content:"Circular: Atlas Tech Careers is opening applications for backend and mobile internship cohorts this month.",
        image:""
    },
    {
        email:"northstar.digital@test.com",
        content:"Circular: NorthStar Digital is inviting students for UI/UX and analytics internship interviews next week.",
        image:""
    },
    {
        email:"pulseworks.labs@test.com",
        content:"Circular: PulseWorks Labs has released a new QA and DevOps internship round with hybrid work options.",
        image:""
    },
    {
        email:"metro.city.university@test.com",
        content:"Circular: Metro City University has opened scholarship applications for merit and need-based awards.",
        image:""
    },
    {
        email:"greenfield.itech@test.com",
        content:"Circular: Greenfield Institute of Technology has published admission and scholarship deadlines for the autumn semester.",
        image:""
    },
    {
        email:"city.horizon.university@test.com",
        content:"Circular: City Horizon University has announced a student career fair and internship referral circular.",
        image:""
    }
];

>>>>>>> 66821a5 (Add updated opportunity calendar feature)
const runSeed=async()=>{

    try{

        await connectDB();

        await Internship.insertMany(internships);
        console.log(`Inserted ${internships.length} internships`);

        await Scholarship.insertMany(scholarships);
        console.log(`Inserted ${scholarships.length} scholarships`);

<<<<<<< HEAD
=======
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
            }
        }

        console.log(`Ensured ${demoUsers.length} demo users exist`);

        for(const profile of demoProfiles){
            const existing=await User.findOne({email:profile.email});

            if(!existing){
                const hashedPassword=await bcrypt.hash(profile.password,10);
                await User.create({
                    _id:profile._id,
                    name:profile.name,
                    email:profile.email,
                    password:hashedPassword,
                    role:profile.role,
                    companyName:profile.companyName||"",
                    universityName:profile.universityName||"",
                    bio:profile.bio||""
                });
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
                    image:circular.image
                });
            }
        }

        console.log(`Ensured ${demoProfiles.length} searchable company/university profiles and circular posts exist`);

>>>>>>> 66821a5 (Add updated opportunity calendar feature)
        console.log("Seeding complete");

        process.exit(0);

    }

    catch(error){

        console.log(error.message);

        process.exit(1);

    }

};

runSeed();