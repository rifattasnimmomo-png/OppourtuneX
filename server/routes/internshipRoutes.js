const express=require("express");

const router=express.Router();

const{
    createInternship,
    getInternships,
    getInternship,
    deleteInternship
}=require("../controllers/internshipController");

router.post("/",createInternship);

router.get("/",getInternships);

router.get("/:id",getInternship);

router.delete("/:id",deleteInternship);

module.exports=router;