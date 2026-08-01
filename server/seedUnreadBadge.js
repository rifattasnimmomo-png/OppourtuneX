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
            companyName:userData.companyName||"",
            universityName:userData.universityName||"",
            bio:userData.bio||""
        });
    }

    return user;
};

const createUnreadMessage=async(senderId,receiverId,text)=>{
    const conversationKey=[senderId.toString(),receiverId.toString()].sort().join(":");

    const existing=await Message.findOne({sender:senderId,receiver:receiverId,text});
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
};

const runSeed=async()=>{
    try{
        await connectDB();

        const rifat=await ensureUser({
            name:"Rifat Momo",
            email:"rifatmomo123@gmail.com",
            password:"momo123",
            role:"student"
        });

        const atlas=await ensureUser({
            name:"Atlas Tech Careers",
            email:"atlas.tech@test.com",
            password:"Test@123",
            role:"company",
            companyName:"Atlas Tech Careers"
        });

        const horizon=await ensureUser({
            name:"City Horizon University",
            email:"city.horizon.university@test.com",
            password:"Test@123",
            role:"university",
            universityName:"City Horizon University"
        });

        await createUnreadMessage(atlas._id, rifat._id, "Atlas Tech Careers: please review your internship application update.");
        await createUnreadMessage(horizon._id, rifat._id, "City Horizon University: new scholarship circular available for your account.");

        console.log("Unread badge messages seeded for rifatmomo123@gmail.com");
        process.exit(0);
    }
    catch(error){
        console.log(error.message);
        process.exit(1);
    }
};

runSeed();
