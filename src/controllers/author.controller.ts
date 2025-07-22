import { Request, Response } from "express";
import prisma from "../prisma.js";
import { addAuthorSchema } from "../zodSchemas/authorSchema.js";
import { cloudinaryUploader } from "../config/cloudinary.config.js";
import fs from "fs";

//-------------------------------get /author/:id details-----------------------

export const getAuthorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const author = await prisma.author.findUnique({
      where: { id },
      include: {
        writtenBooks: {
          include: {
            _count: { select: { likedBy: true, review: true } }, //total likes and reviews count
          },
          orderBy: { createdAt: "desc" },
        },
        createdPost: {
          orderBy: { createdAt: "desc" },
          take: 6,
        },
        createdList: {
          where: { isPublicList: true },
          orderBy: { upVotes: "desc" },
          take: 6,
        },
      },
    });

    if (!author) {
      return res.status(404).json({
        success: false,
        error: "Author not found! invalid credentials",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "getBooks controller error",
    });
  }
};

//-----------------------addAuthor-----------------------------
interface MulterRequest extends Request {
  files: {
    profilePhoto?: Express.Multer.File[]; // multer bydef shows as arrrays
    coverPhoto?: Express.Multer.File[];
  };
}
export const addAuthor = async (req: MulterRequest, res: Response) => {
  try {
    const parsed = addAuthorSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "AddAuthor Zod validation Failed",
        issues: parsed.error.format(),
      });
      return;
    }
    const files = req.files; //multerRequest bruh
    // as {
    //   [fieldName: string]: Express.Multer.File[];
    // };

    // const profilePhotoPath = files?.profil
    const profilePhotoPath = files.profilePhoto?.[0];
    const coverPhotoPath = files.coverPhoto?.[0];

    const responseProfilePic = await cloudinaryUploader(profilePhotoPath);
    //async func so it will return promise u must resolve such shits to make it normal
    const responseCoverPic = await cloudinaryUploader(coverPhotoPath);
    if (!responseCoverPic) {
      console.log("CoverPic not found");
    }
    if (!responseProfilePic) {
      console.log("ProfilePic not found");
    }

    const {
      name,
      titles,
      info,
      role,
      region, //
      languageOfBooks,
      activeUsing,
      // profilePhoto,
      // coverPhoto,
    } = parsed.data;

    const newAuthor = await prisma.author.create({
      data: {
        name,
        titles,
        info,
        region, //
        role,
        languageOfBooks,
        activeUsing,
        profilePhoto: responseProfilePic?.url || null,
        coverPhoto: responseCoverPic?.url || null,
      },
      //include will populate fields
      include: {},
    });

    //delete local photo after delete

    if (profilePhotoPath?.path) fs.unlinkSync(profilePhotoPath.path);
    if (coverPhotoPath?.path) fs.unlinkSync(coverPhotoPath.path);

    res.status(201).json({
      success: true,
      newAuthor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "addAuthor controller error",
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
