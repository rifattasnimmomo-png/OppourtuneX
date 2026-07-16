const mongoose=require("mongoose");

const userSchema=new mongoose.Schema(
{
    name:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },

    password:{
        type:String,
        required:true
    },

    role:{
        type:String,
        enum:["student","company","university","admin"],
        required:true
    },

    profilePicture:{
        type:String,
        default:""
    },
    department:{
        type:String,
        default:""
    },
    phone:{
        type:String,
        default:""
    },
    cgpa:{
        type:Number,
        default:0
    },

    companyName:{
        type:String,
        default:""
    },
    universityName:{
        type:String,
        default:""
    },

    bio:{
        type:String,
        default:""
    }, 
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],

    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]

},
{
    timestamps:true
    
}
);

module.exports=mongoose.model("User",userSchema);