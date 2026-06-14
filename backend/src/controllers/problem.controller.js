import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { getProblems,getProblemBySlug } from "../services/problem.service.js"

const getProblemsController= asyncHandler(async (req,res)=>{
    const params=req.query
    const {problems, pagination}= await getProblems(params)
    return res
    .status(200)
    .json(new ApiResponse( 200, {problems, pagination},"Problems fetched successfully"))
})

const getProblemBySlugController=asyncHandler(async(req, res)=>{
    const params=req.params
    const {problem}= await getProblemBySlug(params)
    return res
    .status(200)
    .json(new ApiResponse( 200, {problem},"Problem fetched successfully"))
})

export {getProblemBySlugController,getProblemsController}