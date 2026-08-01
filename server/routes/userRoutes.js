const express=require("express");

const router=express.Router();

const{
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
<<<<<<< HEAD
=======
    searchUsers,
>>>>>>> 66821a5 (Add updated opportunity calendar feature)
    followUser,
    unfollowUser
}=require("../controllers/userController");

router.post("/register",registerUser);
router.post("/login",loginUser);
<<<<<<< HEAD
=======
router.get("/search",searchUsers);
>>>>>>> 66821a5 (Add updated opportunity calendar feature)
router.get("/:id",getProfile);
router.put("/:id",updateProfile);
router.put("/:id/follow",followUser);

router.put("/:id/unfollow",unfollowUser);

module.exports=router;