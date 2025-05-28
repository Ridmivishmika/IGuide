import formidable from 'formidable';
import fs from 'fs';
import cloudinary from '@/lib/cloudinary';
import connectDB from '@/lib/mongodb';
import PDF from '@/models/pdfModel';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  await connectDB();

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Form parsing error' });

    const file = files.pdf;
    const name = fields.name;

    try {
      const uploadRes = await cloudinary.uploader.upload(file.filepath, {
        resource_type: 'raw', // for PDF
        folder: 'pdfs',
      });

      const newPdf = await PDF.create({
        name,
        cloudinaryId: uploadRes.public_id,
        url: uploadRes.secure_url,
      });

      res.status(200).json(newPdf);
    } catch (error) {
      res.status(500).json({ error: 'Upload failed', details: error.message });
    }
  });
}
