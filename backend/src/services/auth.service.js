import { User } from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js"
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateUniqueUsernameFromGoogle = async (email, name) => {
  const base =
    (name || email.split("@")[0])
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 20) || "user";
 
  const padded = base.length >= 3 ? base : base.padEnd(3, "0");
 
  let candidate = padded;
  let suffix = 0;
  while (await User.findOne({ username: candidate })) {
    suffix += 1;
    candidate = `${padded}${suffix}`;
  }
  return candidate;
};


const loginWithGoogle = async ({ idToken }) => {
  if (!idToken) {
    throw new ApiError(400, "Google ID token is required");
  }
 
  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (error) {
    throw new ApiError(401, "Invalid Google token");
  }
 
  const { sub: googleId, email, name, picture } = payload;
  if (!email) {
    throw new ApiError(400, "Google account has no email");
  }
 
  let user = await User.findOne({ googleId });
 
  if (!user) {
    // No account linked to this Google identity yet. Check whether an
    // existing email/password account already uses this email, and link
    // Google sign-in to it instead of creating a duplicate account.
    user = await User.findOne({ email: email.toLowerCase() });
 
    if (user) {
      user.googleId = googleId;
      if (!user.profilePicture && picture) {
        user.profilePicture = picture;
      }
      await user.save({ validateBeforeSave: false });
    } else {
      const username = await generateUniqueUsernameFromGoogle(email, name);
      user = await User.create({
        username,
        email: email.toLowerCase(),
        googleId,
        profilePicture: picture || "",
        authProvider: "google",
      });
    }
  }
 
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  const loggedInUser = await User.findById(user._id);
 
  return {
    user: loggedInUser,
    accessToken,
    refreshToken,
  };
};

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
const getCurrentUser=async({user})=>{
    return user
}

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

export {registerUser, loginUser, refreshAccessToken, logoutUser,getCurrentUser, loginWithGoogle}
