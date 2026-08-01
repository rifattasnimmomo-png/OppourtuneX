const dotenv=require("dotenv");
const bcrypt=require("bcryptjs");
const connectDB=require("./config/db");
const User=require("./models/User");
const Message=require("./models/Message");
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
            role:userData.role,
            department:userData.department||"",
            companyName:userData.companyName||"",
            universityName:userData.universityName||"",
            bio:userData.bio||""
        });
    }

    return user;
};

const createUnreadMessage=async(senderId,receiverId,text)=>{
    const conversationKey=[senderId.toString(),receiverId.toString()].sort().join(":");
    const existing=await Message.findOne({
        conversationKey,
        text,
        sender:senderId,
        receiver:receiverId
    });

    if(existing){
        return existing;
    }

    const message=await Message.create({
        sender:senderId,
        receiver:receiverId,
        conversationKey,
        text,
        read:false
    });

    const sender=await User.findById(senderId);

    await Notification.create({
        user:receiverId,
        type:"message",
        title:"Unread Message",
        message:`${sender.companyName||sender.universityName||sender.name} sent you a message.`,
        fromUser:senderId,
        relatedMessage:message._id
    });

    return message;
};

const runSeed=async()=>{
    try{
        await connectDB();

        const mainApplicant=await ensureUser({
            name:"Rifat Momo",
            email:"rifatmomo123@gmail.com",
            password:"momo123",
            role:"student",
            bio:"Primary test applicant for all internship and scholarship submissions."
        });

        const atlasTechUser=await ensureUser({
            name:"Atlas Tech Careers",
            email:"atlas.tech@test.com",
            password:"Test@123",
            role:"company",
            companyName:"Atlas Tech Careers",
            bio:"Hiring interns and junior engineers for product, backend, and mobile teams."
        });

        const cityHorizonUser=await ensureUser({
            name:"City Horizon University",
            email:"city.horizon.university@test.com",
            password:"Test@123",
            role:"university",
            universityName:"City Horizon University",
            bio:"Student notices, internship circulars, and financial aid updates."
        });

        await createUnreadMessage(atlasTechUser._id,mainApplicant._id,"Hi Rifat, Atlas Tech Careers wants to connect with you about the backend internship circular.");
        await createUnreadMessage(cityHorizonUser._id,mainApplicant._id,"Hello Rifat, City Horizon University has posted a scholarship circular for you to review.");

        console.log("Seeded unread messages and message notifications for rifatmomo123@gmail.com");
        process.exit(0);
    }
    catch(error){
        console.log(error.message);
        process.exit(1);
    }
};

runSeed();
