const Scholarship=require("../models/Scholarship");

const createScholarship=async(req,res)=>{

    try{

        const scholarship=await Scholarship.create(req.body);

        res.status(201).json({
            message:"Scholarship created successfully",
            scholarship
        });

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

const getScholarships=async(req,res)=>{

    try{

        const scholarships=await Scholarship.find().sort({
            createdAt:-1
        });

        res.status(200).json(scholarships);

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

const getScholarship=async(req,res)=>{

    try{

        const scholarship=await Scholarship.findById(req.params.id);

        if(!scholarship){

            return res.status(404).json({
                message:"Scholarship not found"
            });

        }

        res.status(200).json(scholarship);

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

const updateScholarship=async(req,res)=>{

    try{

        const scholarship=await Scholarship.findById(req.params.id);

        if(!scholarship){

            return res.status(404).json({
                message:"Scholarship not found"
            });

        }

        scholarship.title=req.body.title||scholarship.title;
        scholarship.description=req.body.description||scholarship.description;
        scholarship.amount=req.body.amount||scholarship.amount;
        scholarship.deadline=req.body.deadline||scholarship.deadline;
        scholarship.eligibility=req.body.eligibility||scholarship.eligibility;

        await scholarship.save();

        res.json({
            message:"Scholarship updated successfully",
            scholarship
        });

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

const deleteScholarship=async(req,res)=>{

    try{

        const scholarship=await Scholarship.findById(req.params.id);

        if(!scholarship){

            return res.status(404).json({
                message:"Scholarship not found"
            });

        }

        await scholarship.deleteOne();

        res.json({
            message:"Scholarship deleted successfully"
        });

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

module.exports={
    createScholarship,
    getScholarships,
    getScholarship,
    updateScholarship,
    deleteScholarship
};