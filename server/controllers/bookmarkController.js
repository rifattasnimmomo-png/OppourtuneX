const Bookmark=require("../models/Bookmark");

const addBookmark=async(req,res)=>{

    try{

        const{user,opportunity,opportunityType}=req.body;

        const existing=await Bookmark.findOne({
            user,
            opportunity
        });

        if(existing){

            return res.status(400).json({
                message:"This opportunity is already bookmarked"
            });

        }

        const bookmark=await Bookmark.create({
            user,
            opportunity,
            opportunityType
        });

        res.status(201).json({
            message:"Bookmark added successfully",
            bookmark
        });

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

const removeBookmark=async(req,res)=>{

    try{

        const bookmark=await Bookmark.findById(req.params.id);

        if(!bookmark){

            return res.status(404).json({
                message:"Bookmark not found"
            });

        }

        await bookmark.deleteOne();

        res.json({
            message:"Bookmark removed successfully"
        });

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

const getMyBookmarks=async(req,res)=>{

    try{

        const bookmarks=await Bookmark.find({
            user:req.params.userId
        }).sort({
            createdAt:-1
        });

        res.status(200).json(bookmarks);

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

const updateBookmarkNote=async(req,res)=>{

    try{

        const bookmark=await Bookmark.findById(req.params.id);

        if(!bookmark){

            return res.status(404).json({
                message:"Bookmark not found"
            });

        }

        bookmark.note=req.body.note;

        await bookmark.save();

        res.json({
            message:"Note updated successfully",
            bookmark
        });

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};


module.exports={
    addBookmark,
    removeBookmark,
    getMyBookmarks,
    updateBookmarkNote
};