const Internship=require("../models/Internship");

const createInternship=async(req,res)=>{

    try{

        const internship=await Internship.create(req.body);

        res.status(201).json({
            message:"Internship created successfully",
            internship
        });

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

const getInternships=async(req,res)=>{

    try{

        const{
            keyword,
            location,
            workType,
            minStipend,
            maxStipend,
            deadlineBefore
        }=req.query;

        const filter={};

        if(keyword){
            filter.$or=[
                {title:{$regex:keyword,$options:"i"}},
                {company:{$regex:keyword,$options:"i"}},
                {description:{$regex:keyword,$options:"i"}},
                {skills:{$regex:keyword,$options:"i"}}
            ];
        }

        if(location){
            filter.location={$regex:location,$options:"i"};
        }

        if(workType){
            filter.workType=workType;
        }

        if(minStipend||maxStipend){
            filter.stipend={};
            if(minStipend) filter.stipend.$gte=Number(minStipend);
            if(maxStipend) filter.stipend.$lte=Number(maxStipend);
        }

        if(deadlineBefore){
            filter.deadline={$lte:new Date(deadlineBefore)};
        }

        const internships=await Internship.find(filter).sort({
            createdAt:-1
        });

        res.status(200).json(internships);

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

const getInternship=async(req,res)=>{

    try{

        const internship=await Internship.findById(req.params.id);

        if(!internship){

            return res.status(404).json({
                message:"Internship not found"
            });

        }

        res.status(200).json(internship);

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};
const updateInternship=async(req,res)=>{

    try{

        const internship=await Internship.findById(req.params.id);

        if(!internship){

            return res.status(404).json({
                message:"Internship not found"
            });

        }

        internship.title=req.body.title||internship.title;
        internship.company=req.body.company||internship.company;
        internship.description=req.body.description||internship.description;
        internship.location=req.body.location||internship.location;
        internship.workType=req.body.workType||internship.workType;
        internship.stipend=req.body.stipend||internship.stipend;
        internship.duration=req.body.duration||internship.duration;
        internship.deadline=req.body.deadline||internship.deadline;
        internship.skills=req.body.skills||internship.skills;

        await internship.save();

        res.json({
            message:"Internship updated successfully",
            internship
        });

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

const deleteInternship=async(req,res)=>{

    try{

        const internship=await Internship.findById(req.params.id);

        if(!internship){

            return res.status(404).json({
                message:"Internship not found"
            });

        }

        await internship.deleteOne();

        res.status(200).json({
            message:"Internship deleted successfully"
        });

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

module.exports={
    createInternship,
    getInternships,
    getInternship,
    updateInternship,
    deleteInternship
};