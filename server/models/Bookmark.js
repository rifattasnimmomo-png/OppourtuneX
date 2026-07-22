const mongoose=require("mongoose");

const bookmarkSchema=new mongoose.Schema({

    user:{
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

    note:{
        type:String,
        default:""
    }

},
{
    timestamps:true
});

module.exports=mongoose.model("Bookmark",bookmarkSchema);