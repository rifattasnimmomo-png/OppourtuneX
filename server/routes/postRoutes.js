const express=require("express");

const router=express.Router();
console.log("Post routes loaded");

const{

    createPost,

    getPosts,

    getPost,

    updatePost,

    deletePost,

    likePost,

    addComment,

    getFeed

}=require("../controllers/postController");

router.post("/",createPost);

router.get("/",getPosts);

router.get("/feed/:id",getFeed);

router.get("/:id",getPost);

router.put("/:id",updatePost);

router.delete("/:id",deletePost);

router.put("/:id/like",likePost);

router.post("/:id/comment",addComment);



module.exports=router;