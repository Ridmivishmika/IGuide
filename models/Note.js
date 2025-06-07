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
    language: {
      type: String,
      required: true,
    },
    note: {
      id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      }
    }
  },
  { timestamps: true }
);

// Avoid OverwriteModelError in development
export default mongoose.models.Note || mongoose.model("Note", NoteSchema);
