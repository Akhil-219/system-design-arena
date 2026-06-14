import mongoose ,{Schema}from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema =  new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minlength:3,
        match: [/^[a-z0-9_]+$/, "Invalid username"]
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
        match:[/^\S+@\S+\.\S+$/, "Invalid email"]
    },
    isVerified:{
      type:Boolean,
      default:true,
    },
    password:{
        type:String,
        required:[true, "Password is needed"],
        minlength:8,
        select:false,
    },
    bio:{
        type:String,
        default:""
    },
    profilePicture:{
        type:String,
        default:"" //cloudinary url
    },
    reputation:{
        type:Number,
        default:0,
    },
    followersCount:{
        type:Number,
        default:0,
    },
    followingCount:{
        type:Number,
        default:0,
    },
    refreshToken:{
        type:String,
        select:false
    },

},{timestamps:true})

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return 
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username:this.username,
      email:this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};


export const User= mongoose.model("User",userSchema);