// // // http://localhost:3000/api/pastpaper
// // import Pastpaper from "@/models/Pastpaper";
// // import { connect } from "@/lib/db";
// // import { NextResponse } from "next/server";
// // import { verifyJwtToken } from "@/lib/jwt";

// // export async function POST(req) {
// //   await connect();

// //   const accessToken = req.headers.get("authorization");
// //   const token = accessToken.split(" ")[1];

// //   const decodedToken = verifyJwtToken(token);

// //   if (!accessToken || !decodedToken) {
// //     return new Response(
// //       JSON.stringify({ error: "unauthorized (wrong or expired token" }),
// //       { status: 403 }
// //     );
// //   }

// //   try {
// //     const body = await req.json();
// //     const newpastpaper = await Pastpaper.connect(body);

// //     return NextResponse.json(newpastpaper, { status: 201 });
// //   } catch (error) {
// //     return NextResponse.json({ message: "POST error (create blog)" });
// //   }
// // }
// import Pastpaper from "@/models/Pastpaper";
// import { connect } from "@/lib/db";
// import { NextResponse } from "next/server";
// import { verifyJwtToken } from "@/lib/jwt";

// export async function POST(req) {
//   // await connect();

//   // const accessToken = req.headers.get("authorization");

//   // // Check for missing or invalid token
//   // if (!accessToken || !accessToken.startsWith("Bearer ")) {
//   //   return NextResponse.json(
//   //     { error: "Unauthorized: Missing or invalid token format" },
//   //     { status: 401 }
//   //   );
//   // }

//   // const token = accessToken.split(" ")[1];
//   // const decodedToken = verifyJwtToken(token);

//   // if (!decodedToken) {
//   //   return NextResponse.json(
//   //     { error: "Unauthorized: Invalid or expired token" },
//   //     { status: 403 }
//   //   );
//   // }

//   try {
//     const body = await req.json();
//     const newPastpaper = await Pastpaper.create(body); // ✅ Correct usage

//     return NextResponse.json(newPastpaper, { status: 201 });
//   } catch (error) {
//     console.error("POST /api/pastpaper error:", error);
//     return NextResponse.json(
//       { message: "POST error (create pastpaper)" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(req) {
//   try {
//     await connect();

//     // Optional: You can parse query params from the URL
//     // const { searchParams } = new URL(req.url);
//     // const year = searchParams.get("year");

//     const pastPapers = await Pastpaper.find(); // You can filter like: { year }
//     return NextResponse.json(pastPapers, { status: 200 });
//   } catch (error) {
//     console.error("GET /api/pastpaper error:", error);
//     return NextResponse.json(
//       { message: "GET error (fetch pastpapers)" },
//       { status: 500 }
//     );
//   }
// }

import formidable from "formidable";
import cloudinary from "@/lib/cloudinary";
import fs from "fs";
import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/jwt";
import Note from "@/models/Note";
// Disable default body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Handle POST (with PDF upload)
export async function POST(req) {
  await connect();

  const form = new formidable.IncomingForm({ multiples: false });

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parse error:", err);
        reject(NextResponse.json({ error: "Form parsing failed" }, { status: 400 }));
        return;
      }

      // Optional: Token validation
      // const accessToken = req.headers.get("authorization");
      // if (!accessToken || !accessToken.startsWith("Bearer ")) {
      //   resolve(NextResponse.json({ error: "Unauthorized: Missing or invalid token" }, { status: 401 }));
      //   return;
      // }
      // const token = accessToken.split(" ")[1];
      // const decodedToken = verifyJwtToken(token);
      // if (!decodedToken) {
      //   resolve(NextResponse.json({ error: "Unauthorized: Invalid or expired token" }, { status: 403 }));
      //   return;
      // }

      try {
        const { id, name, level, year } = fields;
        const pdfFile = files.pdf?.[0];

        if (!pdfFile) {
          resolve(NextResponse.json({ error: "PDF file is required" }, { status: 400 }));
          return;
        }

        // Upload PDF to Cloudinary
        const upload = await cloudinary.uploader.upload(pdfFile.filepath, {
          resource_type: "raw",
          folder: "pastpapers",
        });

        // Save to DB
        const newNote = await Note.create({
          id,
          name,
          level,
          year,
          pdfUrl: upload.secure_url,
        });

        resolve(NextResponse.json(newNote, { status: 201 }));
      } catch (uploadError) {
        console.error("Upload error:", uploadError);
        reject(NextResponse.json({ error: "Note upload failed" }, { status: 500 }));
      }
    });
  });
}

// Handle GET
export async function GET(req) {
  try {
    await connect();

    const notes = await Note.find(); // You can filter with query params if needed
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error("GET /api/note error:", error);
    return NextResponse.json(
      { message: "GET error (fetch pastpapers)" },
      { status: 500 }
    );
  }
}
