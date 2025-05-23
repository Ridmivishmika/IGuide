// import mongoose from "mongoose";
// import { unique } from "next/dist/build/utils";

// const NoteSchema = new mongoose.Schema(
//     {
//         id:{
//             type:Number,
//             required:true,
//             unique:true
//         },
//         name:{
//             type:String,
//             required:true
//         }, 
//         level:{
//             type:Number,
//             required:true
//         }, 
//         year:{
//             type:Number,
//             required:true
//         }
//      },{timestamps:true}
// )

// export default mongoose?.model?.Note || mongoose.model("Note",NoteSchema)

import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
     notePdfUrl: {
      type: String, // URL to the uploaded PDF
      required: true,
    },
  },
  { timestamps: true }
);

// Avoid OverwriteModelError in development
export default mongoose.models.Note || mongoose.model("Note", NoteSchema);
