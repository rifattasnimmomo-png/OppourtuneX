const mongoose=require("mongoose");

const applicationSchema=new mongoose.Schema({

    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    opportunity:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },

    opportunityType:{
        type:String,
        enum:["Internship","Scholarship"],
        required:true
    },

    status:{
        type:String,
        enum:["pending","accepted","rejected","withdrawn"],
        default:"pending"
    }

},
{
    timestamps:true
});

module.exports=mongoose.model("Application",applicationSchema);