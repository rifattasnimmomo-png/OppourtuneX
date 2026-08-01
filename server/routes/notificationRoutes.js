const express=require("express");
const router=express.Router();
const{
    getNotifications,
    getUnreadCount,
    markNotificationRead,
    markAllNotificationsRead
}=require("../controllers/notificationController");

router.get("/unread-count/:userId",getUnreadCount);
router.get("/:userId",getNotifications);
router.patch("/read/:id",markNotificationRead);
router.patch("/read-all/:userId",markAllNotificationsRead);

module.exports=router;
