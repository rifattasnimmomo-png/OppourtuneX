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

        const internships=await Internship.find();

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
    deleteInternship
};