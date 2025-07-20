import { Request, Response } from "express";
import prisma from "../prisma.js";

//-------------------------------get /author/:id details-----------------------

export const getAuthorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const author = await prisma.author.findUnique({
      where: { id },
      include: {
        userProfile: true,
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


//-----------------------addAuthor------------------------


// try {
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: "getBooks controller error",
//     });
//   }
