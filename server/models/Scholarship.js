const mongoose=require("mongoose");

const scholarshipSchema=new mongoose.Schema({

    title:{
        type:String,
        required:true
    },

    university:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    amount:{
        type:Number,
        required:true
    },

    deadline:{
        type:Date,
        required:true
    },

    eligibility:{
        type:String,
        required:true
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},
{
    timestamps:true
});

module.exports=mongoose.model("Scholarship",scholarshipSchema);