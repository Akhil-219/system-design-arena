import { Design } from "../models/design.model.js"
import { Version } from "../models/versions.model.js"
import { ApiError } from "../utils/ApiError.js"


const publishDesign=async({versionId, userId})=>{
    // get the version , and user , check the are valid or not ,
    // get the design of the version, if there set the ispublished to ture if nto there
    // else change the publishedVers
    const version= await Version.findById(versionId)
    if(!version){
        throw new ApiError(404,"Version not found")
    }
    if(version.createdBy.toString()!== userId.toString()){
        throw new ApiError(403, "Unauthorised Access")
    }
    const design= version.designId
    if(design.isPosted){
        design.postedVersion=version._id
    }
    else{
        design.isPosted=true;
        design.postedVersion=version._id
    }
    await design.save({validateBeforeSave:false})
    return {version}
}

const getCommunityDesigns=async({problemId})=>{
    const designs= await Design.find({problemId: problemId, isPosted:true})
    return {designs}
}

const getCommunityDesignById=async({problemId, designId})=>{
    const design= await Design.findOne({problemId: problemId, isPosted:true, _id:designId})
    return {design}
}

export {publishDesign, getCommunityDesignById, getCommunityDesigns}