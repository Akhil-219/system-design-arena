import { loginUser, registerUser , refreshAccessToken, logoutUser } from "../services/auth.service.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
const registerUserController=asyncHandler(async(req,res)=>{
    const {username, email,password}= req.body
    const {user, accessToken, refreshToken}=await registerUser({username,email,password})
    const options={
        httpOnly:true,
        secure:true,
    }
    return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
        201,
        { user, accessToken, refreshToken }, 
        "User registered successfully" 
    ))
})

const loginUserController=asyncHandler(async (req, res)=>{
    const {login, password} =req.body
    const {user, accessToken, refreshToken}= await loginUser({login,password})
    const options={
        httpOnly:true,
        secure:true,
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
        200,
        { user, accessToken, refreshToken }, 
        "User loggedIn successfully" 
    ))
})

const refreshAccessTokenController =asyncHandler(async(req, res)=>{
    const incomingRefreshToken=req.cookies.refreshToken;
    const {accessToken, refreshToken}=await refreshAccessToken(incomingRefreshToken)
    const options={
        httpOnly:true,
        secure:true,
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
        200,
        { accessToken, refreshToken }, 
        "accessToken refreshed successfully" 
    ))  
})

const logoutUserController = asyncHandler(async(req,res)=>{
    const userId=req.user._id;// after middleware setup
    const isloggedOut=await logoutUser(userId)
    if(!isloggedOut){
        throw new ApiError(500," Something went wrong while logging out")
    }
    const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "logged out successfully "));
})
