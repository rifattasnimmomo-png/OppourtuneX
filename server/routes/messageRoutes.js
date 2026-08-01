const express=require("express");
const router=express.Router();
const{
    getSearchableUsers,
    getContacts,
    getConversation,
    sendMessage,
    markConversationRead,
    getUnreadMessageCount,
    deleteMessage
}=require("../controllers/messageController");

router.get("/search-users",getSearchableUsers);
router.get("/contacts/:userId",getContacts);
router.get("/conversation/:userId/:otherUserId",getConversation);
router.get("/unread-count/:userId",getUnreadMessageCount);
router.post("/",sendMessage);
router.patch("/read",markConversationRead);
router.delete("/:messageId",deleteMessage);

module.exports=router;
