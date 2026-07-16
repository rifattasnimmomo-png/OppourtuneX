const express=require("express");

const router=express.Router();

const{

    createScholarship,

    getScholarships,

    getScholarship,

    updateScholarship,

    deleteScholarship

}=require("../controllers/scholarshipController");

router.post("/",createScholarship);

router.get("/",getScholarships);

router.get("/:id",getScholarship);

router.put("/:id",updateScholarship);

router.delete("/:id",deleteScholarship);

module.exports=router;