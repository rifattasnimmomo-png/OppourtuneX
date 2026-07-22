const express=require("express");

const router=express.Router();

const{
    addBookmark,
    removeBookmark,
    getMyBookmarks,
    updateBookmarkNote
}=require("../controllers/bookmarkController");

router.post("/",addBookmark);

router.get("/user/:userId",getMyBookmarks);

router.put("/:id/note",updateBookmarkNote);

router.delete("/:id",removeBookmark);

module.exports=router;