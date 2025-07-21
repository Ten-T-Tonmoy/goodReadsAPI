//multer gets pic from frontend goes in mem-> then sent to cloudinary
//cloudinary gives url -> saved to db simply

/**
 * Multer fileName must Match whatEver shit it sending
 * frontend part for file upload
 *
 */

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const cloudinaryUploader = async (
  localPath: any
): Promise<UploadApiResponse | null> => {
  try {
    if (!localPath) return null;

    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });

    console.log(`File uploaded. Available at : ${response.url}`);

    return response;
  } catch (e: any) {
    fs.unlinkSync(localPath);
    if (e !== null) {
      console.log(`Cloudinary uploader error !`, e.message);
    }
    return null;
  }
};

// export const cloudinaryStorage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     return {
//       folder: `${process.env.NODE_ENV}/uploads`,
//       allowed_format: ["jpg", "png", "jpeg", "webp", "gif"],
//       transformation: [
//         {
//           width: 1000,
//           height: 1000,
//           crop: "limit",
//         },
//       ],
//       public_id: `${Date.now()}-${file.originalname.split(".")[0]}`, //bruh name
//     };
//   },
// });

export default cloudinary;
