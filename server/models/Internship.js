const mongoose=require("mongoose");

const internshipSchema=new mongoose.Schema({

    title:{
        type:String,
        required:true
    },

    company:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    location:{
        type:String,
        required:true
    },

    workType:{
        type:String,
        enum:["Remote","Onsite","Hybrid"],
        default:"Onsite"
    },

    stipend:{
        type:Number,
        default:0
    },

    duration:{
        type:String,
        required:true
    },

    deadline:{
        type:Date,
        required:true
    },

    skills:[
        {
            type:String
        }
    ],

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},
{
    timestamps:true
});

module.exports=mongoose.model("Internship",internshipSchema);