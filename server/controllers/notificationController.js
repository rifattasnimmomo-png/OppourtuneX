const Notification=require("../models/Notification");
const Internship=require("../models/Internship");
const Scholarship=require("../models/Scholarship");

const getOpportunityName=async(application)=>{
    if(!application){
        return "Application";
    }

    if(application.opportunityType==="Internship"){
        const internship=await Internship.findById(application.opportunity).select("title");
        return internship?.title||"Internship application";
    }

    if(application.opportunityType==="Scholarship"){
        const scholarship=await Scholarship.findById(application.opportunity).select("title");
        return scholarship?.title||"Scholarship application";
    }

    return "Application";
};

const parseOpportunityNameFromTitle=(title)=>{
    if(!title) return null;
    const match=title.match(/Your application for (.+?) is/i);
    return match?.[1] || null;
};

const parseSenderNameFromTitle=(title)=>{
    if(!title) return null;
    const match=title.match(/Unread message from (.+)/i);
    return match?.[1] || null;
};

const getNotifications=async(req,res)=>{
    try{
        const notifications=await Notification.find({user:req.params.userId})
            .populate("fromUser","name role companyName universityName")
            .populate("relatedApplication")
            .populate("relatedMessage")
            .sort({createdAt:-1});

        const enrichedNotifications=[];

        for(const notification of notifications){
            const plain=notification.toObject();

            if(notification.type==="message"){
                const senderName=notification.fromUser?.companyName||notification.fromUser?.universityName||notification.fromUser?.name||parseSenderNameFromTitle(notification.title)||"Someone";

                enrichedNotifications.push({
                    ...plain,
                    displayTitle:`Unread message from ${senderName}`,
                    displayMessage:`${senderName} sent you a message.`,
                    senderName
                });
                continue;
            }

            if(notification.type==="application"){
                const parsedTitleOpportunity=parseOpportunityNameFromTitle(notification.title);
                const opportunityName=await getOpportunityName(notification.relatedApplication) || parsedTitleOpportunity || "Application";
                const statusText=notification.title?.toLowerCase().includes("accepted")
                    ? "accepted"
                    : notification.title?.toLowerCase().includes("rejected")
                        ? "rejected"
                        : "pending";

                enrichedNotifications.push({
                    ...plain,
                    opportunityName,
                    displayTitle:`Your application for ${opportunityName} is ${statusText}`,
                    displayMessage:`Your application for ${opportunityName} is ${statusText}.`
                });
                continue;
            }

            enrichedNotifications.push({
                ...plain,
                displayTitle:notification.title,
                displayMessage:notification.message
            });
        }

        res.status(200).json(enrichedNotifications);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
};

const getUnreadCount=async(req,res)=>{
    try{
        const count=await Notification.countDocuments({
            user:req.params.userId,
            read:false
        });

        res.status(200).json({count});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
};

const markNotificationRead=async(req,res)=>{
    try{
        const notification=await Notification.findById(req.params.id);

        if(!notification){
            return res.status(404).json({message:"Notification not found"});
        }

        notification.read=true;
        notification.readAt=new Date();
        await notification.save();

        res.status(200).json({message:"Notification marked as read", notification});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
};

const markAllNotificationsRead=async(req,res)=>{
    try{
        await Notification.updateMany(
            {
                user:req.params.userId,
                read:false
            },
            {
                $set:{read:true,readAt:new Date()}
            }
        );

        res.status(200).json({message:"All notifications marked as read"});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
};

module.exports={
    getNotifications,
    getUnreadCount,
    markNotificationRead,
    markAllNotificationsRead
};
