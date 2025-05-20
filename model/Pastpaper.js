import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";

const PastPaperSchema = new mongoose.Schema(
    {
        id:{
            type:int,
            required:true,
            unique:true
        },
          name:{
            type:String,
            required:true
        }, 
        level:{
            type:int,
            required:true
        }, 
        year:{
            type:String,
            required:true
        }
     },{timestamps:true}
)

export default mongoose?.model?.PastPaper || mongoose.model("Pastpaper",PastPaperSchema)