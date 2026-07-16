const mongoose=require("mongoose");

const postSchema=new mongoose.Schema({

    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    authorName:{
        type:String,
        required:true
    },

    authorRole:{
        type:String,
        required:true
    },

    content:{
        type:String,
        required:true
    },

    image:{
        type:String,
        default:""
    },

    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    comments:[
      {

        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },

        name:{
            type:String
        },

        comment:{
            type:String
        },

        createdAt:{
            type:Date,
            default:Date.now
        }

      }
    ],
},
{
    timestamps:true
});

module.exports=mongoose.model("Post",postSchema);