import mongoose ,{Schema}from "mongoose";

const versionSchema= new Schema({
    designId:{
        type:Schema.Types.ObjectId,
        ref:"Design",
        required:true,
    },
    versionNumber:{
        type:Number,
        default:1,
    },
    diagramData:{
        type:Object,
        required:true,
    },
    notes:{
        type:String,
        default:"",
    },
},{timestamps:true})

export const Version= mongoose.model("Version",versionSchema)