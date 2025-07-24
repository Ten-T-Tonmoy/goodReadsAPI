import { Request, Response } from "express";
import { addUserSchema } from "../zodSchemas/userSchema";
import { cloudinaryUploader } from "../config/cloudinary.config";
import prisma from "../prisma";
import fs from "fs";

//-------------------------create new User------------------------------------

interface MulterRequest extends Request {
  files: {
    profilePhoto?: Express.Multer.File[];
    coverPhoto?: Express.Multer.File[];
  };
}

export const addUser = async (req: Request, res: Response) => {
  try {
    const parsed = addUserSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "AddAuthor Zod validation Failed",
        issues: parsed.error.format(),
      });
      return;
    }

    // make sure to keep name same?
    const files = req.files as {
      profilePhoto?: Express.Multer.File[];
      coverPhoto?: Express.Multer.File[];
    };
    const profilePhotoPath = files.profilePhoto?.[0];
    const coverPhotoPath = files.coverPhoto?.[0];

    const responseProfilePic = await cloudinaryUploader(profilePhotoPath);
    const responseCoverPic = await cloudinaryUploader(coverPhotoPath);
    //using cloudinary uploader.upload

    if (!responseCoverPic) {
      console.log("CoverPic not found");
    }
    if (!responseProfilePic) {
      console.log("ProfilePic not found");
    }

    const {
      name,
      about,

      email,
      gender,
      region,
    } = parsed.data;

    //future place empty for created at
    const newUser = await prisma.user.create({
      data: {
        name,
        gender,
        about,
        email,
        region,
      },
    });

    if (profilePhotoPath?.path) fs.unlinkSync(profilePhotoPath.path);
    if (coverPhotoPath?.path) fs.unlinkSync(coverPhotoPath.path);

    res.status(201).json({
      success: true,
      newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "addUser controller error",
    });
  }
};

// try {
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: "getBooks controller error",
//     });
//   }
