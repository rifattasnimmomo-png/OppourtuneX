const mongoose=require("mongoose");

const notificationSchema=new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
            index:true
        },
        type:{
            type:String,
            enum:["message","application"],
            required:true
        },
        title:{
            type:String,
            required:true
        },
        message:{
            type:String,
            required:true
        },
        fromUser:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        relatedApplication:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Application"
        },
        relatedMessage:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message"
        },
        read:{
            type:Boolean,
            default:false
        },
        readAt:{
            type:Date,
            default:null
        }
    },
    {
        timestamps:true
    }
);

notificationSchema.index({user:1,read:1,createdAt:-1});

module.exports=mongoose.model("Notification",notificationSchema);
