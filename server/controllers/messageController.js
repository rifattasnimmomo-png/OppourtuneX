const Message=require("../models/Message");
const Notification=require("../models/Notification");
const User=require("../models/User");

const getSearchableUsers=async(req,res)=>{
    try{
        const query=(req.query.query||"").trim();
        const currentUserId=req.query.currentUserId;

        const filter={};

        if(currentUserId){
            filter._id={$ne:currentUserId};
        }

        if(query){
            const regex=new RegExp(query,"i");
            filter.$or=[
                {name:regex},
                {email:regex},
                {companyName:regex},
                {universityName:regex},
                {department:regex},
                {role:regex}
            ];
        }

        const users=await User.find(filter)
            .select("-password -__v")
            .sort({name:1})
            .limit(30);

        const results=users.map((user)=>{
            const plain=user.toObject();
            return {
                ...plain,
                displayName:user.companyName||user.universityName||user.name,
                subtitle:user.role==="company"
                    ? user.companyName
                    : user.role==="university"
                        ? user.universityName
                        : user.department||user.email
            };
        });

        res.status(200).json(results);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
};

const getContacts=async(req,res)=>{
    try{
        const userId=req.params.userId;
        const messages=await Message.find({
            $or:[{sender:userId},{receiver:userId}]
        })
            .populate("sender","name role companyName universityName")
            .populate("receiver","name role companyName universityName")
            .sort({createdAt:1});

        const contactsMap=new Map();

        messages.forEach((message)=>{
            const senderId=message.sender?._id?.toString();
            const receiverId=message.receiver?._id?.toString();
            const otherUser=senderId===userId ? message.receiver : message.sender;
            const otherUserId=otherUser?._id?.toString();

            if(!otherUserId){
                return;
            }

            const existing=contactsMap.get(otherUserId);
            const unreadCount=message.receiver?._id?.toString()===userId && !message.read ? 1 : 0;

            if(!existing || new Date(message.createdAt)>new Date(existing.lastMessageAt)){
                contactsMap.set(otherUserId,{
                    user:{
                        id:otherUser._id,
                        name:otherUser.companyName||otherUser.universityName||otherUser.name,
                        role:otherUser.role,
                        companyName:otherUser.companyName||"",
                        universityName:otherUser.universityName||""
                    },
                    lastMessage:message.text,
                    lastMessageAt:message.createdAt,
                    unreadCount:(existing?.unreadCount||0)+unreadCount
                });
            }
            else if(unreadCount){
                existing.unreadCount+=unreadCount;
                contactsMap.set(otherUserId,existing);
            }
        });

        const contacts=[...contactsMap.values()].sort((a,b)=>new Date(b.lastMessageAt)-new Date(a.lastMessageAt));

        res.status(200).json(contacts);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
};

const getConversation=async(req,res)=>{
    try{
        const{userId,otherUserId}=req.params;
        const conversationKey=[userId,otherUserId].sort().join(":");

        const messages=await Message.find({conversationKey})
            .populate("sender","name role companyName universityName")
            .populate("receiver","name role companyName universityName")
            .sort({createdAt:1});

        res.status(200).json(messages);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
};

const sendMessage=async(req,res)=>{
    try{
        const{senderId,receiverId,text}=req.body;

        if(!senderId||!receiverId||!text?.trim()){
            return res.status(400).json({message:"Sender, receiver and text are required"});
        }

        const sender=await User.findById(senderId);
        const receiver=await User.findById(receiverId);

        if(!sender||!receiver){
            return res.status(404).json({message:"User not found"});
        }

        const conversationKey=[senderId,receiverId].sort().join(":");
        const message=await Message.create({
            sender:senderId,
            receiver:receiverId,
            conversationKey,
            text:text.trim(),
            read:false
        });

        const senderLabel=sender.companyName||sender.universityName||sender.name;

        await Notification.create({
            user:receiverId,
            type:"message",
            title:`Unread message from ${senderLabel}`,
            message:`${senderLabel} sent you a message.`,
            fromUser:senderId,
            relatedMessage:message._id
        });

        const populated=await message.populate([
            {path:"sender",select:"name role companyName universityName"},
            {path:"receiver",select:"name role companyName universityName"}
        ]);

        res.status(201).json({
            message:"Message sent successfully",
            data:populated
        });
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
};

const markConversationRead=async(req,res)=>{
    try{
        const{userId,otherUserId}=req.body;

        if(!userId||!otherUserId){
            return res.status(400).json({message:"userId and otherUserId are required"});
        }

        const conversationKey=[userId,otherUserId].sort().join(":");

        await Message.updateMany(
            {
                conversationKey,
                receiver:userId,
                read:false
            },
            {
                $set:{read:true,readAt:new Date()}
            }
        );

        await Notification.updateMany(
            {
                user:userId,
                type:"message",
                fromUser:otherUserId,
                read:false
            },
            {
                $set:{read:true,readAt:new Date()}
            }
        );

        res.status(200).json({message:"Conversation marked as read"});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
};

const getUnreadMessageCount=async(req,res)=>{
    try{
        const userId=req.params.userId;

        const count=await Message.countDocuments({
            receiver:userId,
            read:false
        });

        res.status(200).json({count});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
};

const deleteMessage=async(req,res)=>{
    try{
        const{messageId}=req.params;
        const{userId}=req.body;

        if(!userId){
            return res.status(400).json({message:"userId is required"});
        }

        const message=await Message.findById(messageId);

        if(!message){
            return res.status(404).json({message:"Message not found"});
        }

        const senderId=message.sender.toString();
        const currentUserId=userId.toString();

        if(currentUserId!==senderId){
            return res.status(403).json({message:"You can only delete your own messages"});
        }

        await Notification.deleteMany({relatedMessage:message._id});
        await Message.deleteOne({_id:message._id});

        res.status(200).json({message:"Message deleted successfully"});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
};

module.exports={
    getSearchableUsers,
    getContacts,
    getConversation,
    sendMessage,
    markConversationRead,
    getUnreadMessageCount,
    deleteMessage
};
