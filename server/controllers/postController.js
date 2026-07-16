const Post=require("../models/Post");
const User=require("../models/User");

const createPost=async(req,res)=>{

    try{

        const{
            author,
            content,
            image
        }=req.body;

        const user=await User.findById(author);

        if(!user){

            return res.status(404).json({
                message:"User not found"
            });

        }

        const post=await Post.create({

            author,

            authorName:user.name,

            authorRole:user.role,

            content,

            image

        });

        res.status(201).json({

            message:"Post created successfully",

            post

        });

    }

    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};


const getPosts=async(req,res)=>{

    try{

        const posts=await Post.find().sort({

            createdAt:-1

        });

        res.status(200).json(posts);

    }

    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};



const getPost=async(req,res)=>{

    try{

        const post=await Post.findById(req.params.id);

        if(!post){

            return res.status(404).json({

                message:"Post not found"

            });

        }

        res.status(200).json(post);

    }

    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};




const updatePost=async(req,res)=>{

    try{

        const post=await Post.findById(req.params.id);

        if(!post){

            return res.status(404).json({

                message:"Post not found"

            });

        }

        post.content=req.body.content||post.content;

        post.image=req.body.image||post.image;

        await post.save();

        res.status(200).json({

            message:"Post updated",

            post

        });

    }

    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};


const deletePost=async(req,res)=>{

    try{

        const post=await Post.findById(req.params.id);

        if(!post){

            return res.status(404).json({

                message:"Post not found"

            });

        }

        await post.deleteOne();

        res.status(200).json({

            message:"Post deleted"

        });

    }

    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};


const likePost=async(req,res)=>{

    try{

        const post=await Post.findById(req.params.id);

        if(!post){

            return res.status(404).json({
                message:"Post not found"
            });

        }

        const userId=req.body.userId;

        if(post.likes.includes(userId)){

            post.likes=post.likes.filter(
                id=>id.toString()!==userId
            );

            await post.save();

            return res.json({
                message:"Post unliked",
                likes:post.likes.length
            });

        }

        post.likes.push(userId);

        await post.save();

        res.json({

            message:"Post liked",

            likes:post.likes.length

        });

    }

    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};


const addComment=async(req,res)=>{

    try{

        const post=await Post.findById(req.params.id);

        if(!post){

            return res.status(404).json({

                message:"Post not found"

            });

        }

        const user=await User.findById(req.body.userId);

        if(!user){

            return res.status(404).json({

                message:"User not found"

            });

        }

        post.comments.push({

            user:user._id,

            name:user.name,

            comment:req.body.comment

        });

        await post.save();

        res.status(201).json({

            message:"Comment added",

            comments:post.comments

        });

    }

    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};

const getFeed=async(req,res)=>{

    try{

        const user=await User.findById(req.params.id);

        if(!user){

            return res.status(404).json({
                message:"User not found"
            });

        }

        const ids=[
            user._id,
            ...user.following
        ];

        const posts=await Post.find({

            author:{
                $in:ids
            }

        }).sort({

            createdAt:-1

        });

        res.status(200).json(posts);

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




module.exports={

    createPost,

    getPosts,

    getPost,

    updatePost,

    deletePost,

    likePost,

    addComment,

    getFeed

};