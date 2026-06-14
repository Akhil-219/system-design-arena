import { User } from "../models/user.model.js";
import {ApiError} from "../utiles/ApiError.js"
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(404,"User not found")
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); // no need to check everything
    return { accessToken, refreshToken };
};

const registerUser =async ({ username, email, password }) => {
    if (!username || !email||!password) {
        throw new ApiError(400, "All fields are required");
    }
    username=username.toLowerCase()
    email=email.toLowerCase()
    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });
    if(existedUser){
        throw new ApiError(400, "UserName or Email already exists")
    }
    const user= await User.create({
        username,
        email,
        password,
    })
    const createdUser= await User.findById(user._id)
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while creating User")
    }
    const {accessToken, refreshToken}= await generateAccessAndRefreshTokens(createdUser._id)
    return {
        user:createdUser,
        accessToken,
        refreshToken
    }
};


const loginUser=async({login,password})=>{
    //we get (username/email)=>login (say) ,password
    //check both fields are there or not, if not there error
    //get the user with username/email if no user return error
    //user the ispassword correct method to check
    // if done user is logged in else incorrect password
    //return refresh token generate, cookies ki send karo
    if(!password||!login){
        throw new ApiError(400,"All fields required")
    }
    login=login.toLowerCase()
    const user =await User.findOne({
        $or:[
            { username: login },
            { email: login }
        ]
    }).select("+password");
    if(!user){
        throw new ApiError(401,"Invalid credentials")
    }
    const isPasswordValid=await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid credentials")
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id,);

    const loggedInUser=await User.findById(user._id)

    return {
        user:loggedInUser,
        accessToken,
        refreshToken,
    }
};

const refreshAccessToken=async(incomingRefreshToken)=>{
    //check if we have recieved the roken or not
    //jwt verfiy the token
    // find the user based on that token,
    //generate the new token and send them back
    if(!incomingRefreshToken){
        throw new ApiError(400,"refreshToken expired or invalid")
    }
    let decodedToken;
    try {
        decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
        throw new ApiError(401,"Invalid refreshToken")
    }
    const user = await User.findById(decodedToken?._id).select("+refreshToken")

    if (!user) {
      throw new ApiError(401, "Invalid, refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const {accessToken, refreshToken}= await generateAccessAndRefreshTokens(user._id);

    return {
        accessToken,
        refreshToken
    }
};

const logoutUser=async (userId)=>{
    // find the user , 
    // get the user refreshtoken,
    // user.refreshtoken =undef
    // user.save , and validate: false
    const user= await User.findById(userId)
    if(!user){
        throw new ApiError(401,"User not found")
    }
    user.refreshToken=undefined
    await user.save({validateBeforeSave:false})
    return true
}

export {registerUser, loginUser, refreshAccessToken, logoutUser}
