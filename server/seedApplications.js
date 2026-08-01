const dotenv=require("dotenv");
const bcrypt=require("bcryptjs");
const connectDB=require("./config/db");
const User=require("./models/User");
const Internship=require("./models/Internship");
const Scholarship=require("./models/Scholarship");
const Application=require("./models/Application");
const Notification=require("./models/Notification");

dotenv.config();

const ensureUser=async(userData)=>{
    let user=await User.findOne({email:userData.email});

    if(!user){
        const hashedPassword=await bcrypt.hash(userData.password,10);
        user=await User.create({
            name:userData.name,
            email:userData.email,
            password:hashedPassword,
            role:"student",
            department:userData.department||"",
            companyName:"",
            universityName:userData.universityName||"",
            bio:userData.bio||""
        });
    }

    return user;
};

const ensureOpportunity=async(model,lookup,createData)=>{
    let item=await model.findOne(lookup);

    if(!item){
        item=await model.create(createData);
    }

    return item;
};

const createApplication=async(studentId,opportunityId,opportunityType)=>{
    const existing=await Application.findOne({
        student:studentId,
        opportunity:opportunityId,
        status:{$in:["pending","accepted"]}
    });

    if(existing){
        return existing;
    }

    const application=await Application.create({
        student:studentId,
        opportunity:opportunityId,
        opportunityType
    });

    await Notification.create({
        user:studentId,
        type:"application",
        title:"Application Pending",
        message:`Your ${opportunityType.toLowerCase()} application is pending.`,
        relatedApplication:application._id
    });

    return application;
};

const runSeed=async()=>{
    try{
        await connectDB();

        const mainApplicant=await ensureUser({
            name:"Rifat Momo",
            email:"rifatmomo123@gmail.com",
            password:"momo123",
            bio:"Primary test applicant for all internship and scholarship submissions."
        });

        const atlasTechUser=await User.findOne({email:"atlas.tech@test.com"});
        const cityHorizonUser=await User.findOne({email:"city.horizon.university@test.com"});

        const atlasOpportunity=await ensureOpportunity(
            Internship,
            {title:"Atlas Tech Backend Internship",company:"Atlas Tech Careers"},
            {
                title:"Atlas Tech Backend Internship",
                company:"Atlas Tech Careers",
                description:"Backend internship circular for students who want to build REST APIs and platform features.",
                location:"Remote",
                workType:"Remote",
                stipend:15000,
                duration:"4 months",
                deadline:new Date("2026-11-30"),
                skills:["Node.js","Express","MongoDB"],
                createdBy:atlasTechUser?._id
            }
        );

        const cityHorizonOpportunity=await ensureOpportunity(
            Scholarship,
            {title:"City Horizon Merit Scholarship",university:"City Horizon University"},
            {
                title:"City Horizon Merit Scholarship",
                university:"City Horizon University",
                description:"Merit scholarship circular for high-performing students applying to City Horizon University.",
                amount:35000,
                deadline:new Date("2026-10-15"),
                eligibility:"CGPA 3.5 or above, submitted transcripts required",
                createdBy:cityHorizonUser?._id
            }
        );

        const internships=await Internship.find();
        const scholarships=await Scholarship.find();

        for(const internship of internships){
            await createApplication(mainApplicant._id,internship._id,"Internship");
        }

        for(const scholarship of scholarships){
            await createApplication(mainApplicant._id,scholarship._id,"Scholarship");
        }

        const extraApplicants=[
            {
                name:"Atlas Applicant One",
                email:"atlas.applicant1@test.com",
                password:"Test@123",
                bio:"Applicant focused on Atlas Tech careers and backend roles."
            },
            {
                name:"City Horizon Applicant One",
                email:"city.horizon.applicant1@test.com",
                password:"Test@123",
                bio:"Applicant focused on City Horizon scholarships and academic support."
            },
            {
                name:"City Horizon Applicant Two",
                email:"city.horizon.applicant2@test.com",
                password:"Test@123",
                bio:"Additional applicant tracking City Horizon university opportunities."
            }
        ];

        const extraUsers=[];

        for(const applicant of extraApplicants){
            extraUsers.push(await ensureUser(applicant));
        }

        await createApplication(extraUsers[0]._id,atlasOpportunity._id,"Internship");
        await createApplication(extraUsers[1]._id,cityHorizonOpportunity._id,"Scholarship");
        await createApplication(extraUsers[2]._id,cityHorizonOpportunity._id,"Scholarship");

        console.log("Seeded applications, applicants, and pending notifications");
        console.log(`Main applicant: rifatmomo123@gmail.com / momo123`);
        console.log(`Extra applicants: atlas.applicant1@test.com / Test@123, city.horizon.applicant1@test.com / Test@123, city.horizon.applicant2@test.com / Test@123`);
        process.exit(0);
    }
    catch(error){
        console.log(error.message);
        process.exit(1);
    }
};

runSeed();
