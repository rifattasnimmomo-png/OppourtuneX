const generateToken=require("../utils/generateToken");
const User=require("../models/User");
const bcrypt=require("bcryptjs");

const registerUser=async(req,res)=>{
    try{

        const{name,email,password,role}=req.body;

        if(!name||!email||!password||!role){
            return res.status(400).json({
                message:"Please fill all required fields"
            });
        }

        const existingUser=await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                message:"Email already registered"
            });
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const user=await User.create({
            name,
            email,
            password:hashedPassword,
            role
        });

        res.status(201).json({
            message:"User registered successfully",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        });

    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }
};



const loginUser=async(req,res)=>{
    try{

        const{email,password}=req.body;

        if(!email||!password){
            return res.status(400).json({
                message:"Please enter email and password"
            });
        }

        const user=await User.findOne({email});

        if(!user){
            return res.status(400).json({
                message:"Invalid email or password"
            });
        }

        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({
                message:"Invalid email or password"
            });
        }

        const token=generateToken(user._id);

        res.status(200).json({
            message:"Login successful",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        });

    }
    catch(error){

        res.status(500).json({
            message:error.message
        });

    }
};

const getProfile=async(req,res)=>{

    try{

        const user=await User.findById(req.params.id).select("-password -__v -createdAt -updatedAt");
        if(!user){

            return res.status(404).json({
                message:"User not found"
            });

        }

        res.status(200).json(user);

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

const updateProfile=async(req,res)=>{

    try{

        const user=await User.findById(req.params.id);

        if(!user){

            return res.status(404).json({
                message:"User not found"
            });

        }

        user.name=req.body.name||user.name;
        user.phone=req.body.phone||user.phone;
        user.bio=req.body.bio||user.bio;
        user.department=req.body.department||user.department;
        user.cgpa=req.body.cgpa||user.cgpa;
        user.companyName=req.body.companyName||user.companyName;
        user.universityName=req.body.universityName||user.universityName;

        await user.save();


        
    res.status(200).json({
        message:"Profile updated successfully",
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            phone:user.phone,
            bio:user.bio,
            department:user.department,
            cgpa:user.cgpa,
            companyName:user.companyName,
            universityName:user.universityName,
            profilePicture:user.profilePicture
        }
    });

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

const followUser=async(req,res)=>{

    try{

        const currentUser=await User.findById(req.body.userId);

        const targetUser=await User.findById(req.params.id);

        if(!currentUser||!targetUser){

            return res.status(404).json({
                message:"User not found"
            });

        }

        if(
            targetUser.role!=="company" &&
            targetUser.role!=="university"
        ){

            return res.status(400).json({
                message:"You can only follow companies or universities"
            });

        }

        if(currentUser.following.includes(targetUser._id)){

            return res.status(400).json({
                message:"Already following"
            });

        }

        currentUser.following.push(targetUser._id);

        targetUser.followers.push(currentUser._id);

        await currentUser.save();

        await targetUser.save();

        res.json({
            message:"Followed successfully"
        });

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

const unfollowUser=async(req,res)=>{

    try{

        const currentUser=await User.findById(req.body.userId);

        const targetUser=await User.findById(req.params.id);

        if(!currentUser||!targetUser){

            return res.status(404).json({
                message:"User not found"
            });

        }

        currentUser.following=currentUser.following.filter(
            id=>id.toString()!==targetUser._id.toString()
        );

        targetUser.followers=targetUser.followers.filter(
            id=>id.toString()!==currentUser._id.toString()
        );

        await currentUser.save();

        await targetUser.save();

        res.json({
            message:"Unfollowed successfully"
        });

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




module.exports={
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    followUser,
    unfollowUser
};