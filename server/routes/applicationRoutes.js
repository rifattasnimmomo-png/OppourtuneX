const express=require("express");

const router=express.Router();

const{
    applyForOpportunity,
    getApplicationsForOpportunity,
    getMyApplications,
    updateApplicationStatus,
    withdrawApplication
}=require("../controllers/applicationController");

router.post("/",applyForOpportunity);

router.get("/opportunity/:opportunityId",getApplicationsForOpportunity);

router.get("/student/:studentId",getMyApplications);

router.put("/:id/status",updateApplicationStatus);

router.put("/:id/withdraw",withdrawApplication);

module.exports=router;