const Application=require("../models/Application");

const applyForOpportunity=async(req,res)=>{

    try{

        const{student,opportunity,opportunityType}=req.body;

        const existing=await Application.findOne({
            student,
            opportunity,
            status:{$in:["pending","accepted"]}
        });

        if(existing){

            return res.status(400).json({
                message:"You have already applied for this opportunity"
            });

        }

        const application=await Application.create({
            student,
            opportunity,
            opportunityType
        });

        res.status(201).json({
            message:"Application submitted successfully",
            application
        });

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

const getApplicationsForOpportunity=async(req,res)=>{

    try{

        const applications=await Application.find({
            opportunity:req.params.opportunityId
        }).populate("student","name email").sort({
            createdAt:1
        });

        res.status(200).json(applications);

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

const getMyApplications=async(req,res)=>{

    try{

        const applications=await Application.find({
            student:req.params.studentId
        }).sort({
            createdAt:-1
        });

        res.status(200).json(applications);

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

const updateApplicationStatus=async(req,res)=>{

    try{

        const application=await Application.findById(req.params.id);

        if(!application){

            return res.status(404).json({
                message:"Application not found"
            });

        }

        application.status=req.body.status||application.status;

        await application.save();

        res.json({
            message:"Application status updated successfully",
            application
        });

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

const withdrawApplication=async(req,res)=>{

    try{

        const application=await Application.findById(req.params.id);

        if(!application){

            return res.status(404).json({
                message:"Application not found"
            });

        }

        application.status="withdrawn";

        await application.save();

        res.json({
            message:"Application withdrawn successfully",
            application
        });

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

module.exports={
    applyForOpportunity,
    getApplicationsForOpportunity,
    getMyApplications,
    updateApplicationStatus,
    withdrawApplication
};