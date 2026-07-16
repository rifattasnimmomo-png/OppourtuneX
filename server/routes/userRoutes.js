const express=require("express");

const router=express.Router();

const{
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    followUser,
    unfollowUser
}=require("../controllers/userController");

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/:id",getProfile);
router.put("/:id",updateProfile);
router.put("/:id/follow",followUser);

router.put("/:id/unfollow",unfollowUser);

module.exports=router;