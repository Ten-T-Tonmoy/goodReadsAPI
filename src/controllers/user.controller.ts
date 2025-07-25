import { Request, Response } from "express";
import { addUserSchema } from "../zodSchemas/userSchema";
import { cloudinaryUploader } from "../config/cloudinary.config";
import prisma from "../prisma";
import fs from "fs";

/**
 * controllers at a glance
 * ✅addUser -> multipage login form FE
 * ✅getUserById
 * ✅updateUserById
 * ✅deleteUserById
 */

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
        profilePhoto: responseProfilePic?.url,
        coverPhoto: responseCoverPic?.url,
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

//-----------------------------------getUSerById---------------------------

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // fetch(`http://localhost:3000/users/${userId}`) from FE

    const gottenUser = await prisma.user.findUnique({
      where: { id },
      include: {
        createdBookList: {
          where: { isPublicList: true },
          orderBy: { upVotes: "desc" },
          take: 6,
        },
        writtenArticles: {
          orderBy: { createdAt: "desc" },
          take: 6,
        },
        writtenReviews: {
          orderBy: { createdAt: "desc" },
          take: 6,
        },
      },
    });

    if (!gottenUser) {
      res.status(404).json({
        success: false,
        error: "User not found! invalid credentials",
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "getUserById controller error",
    });
  }
};

//---------------------------------updateUser--------------------------------
// NB>>> send old data that is unchanged
const updateUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = addUserSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Zod validation Failed for updating",
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

    const responseProfilePic = profilePhotoPath
      ? await cloudinaryUploader(profilePhotoPath)
      : undefined;
    const responseCoverPic = coverPhotoPath
      ? await cloudinaryUploader(coverPhotoPath)
      : undefined;
    //using cloudinary uploader.upload

    // interface updator{
    //   name:string,
    //     gender:boolean,
    //     about:string,
    //     email:string,
    //     region:string,
    //     profilePhoto?:string,
    //     coverPhoto:string,
    // }

    const updateData: any = {
      ...parsed.data,
    };

    if (responseProfilePic?.url) {
      updateData.profilePhoto = responseProfilePic.url;
    }

    if (responseCoverPic?.url) {
      updateData.coverPhoto = responseCoverPic.url;
    }

    //future place empty for created at
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        //...parsed.data
        ...updateData,
        // profilePhoto: responseProfilePic?.url,
        // coverPhoto: responseCoverPic?.url,
      },
    });

    if (profilePhotoPath?.path) fs.unlinkSync(profilePhotoPath.path);
    if (coverPhotoPath?.path) fs.unlinkSync(coverPhotoPath.path);

    res.status(200).json({
      //200 for update
      success: true,
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "updateUser controller error",
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
