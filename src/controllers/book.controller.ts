import prisma from "../prisma";
import { Request, Response } from "express";

import { bookType } from "../types";
import { BookType } from "@prisma/client";

export const getBooksHomePage = async (req: Request, res: Response) => {
  try {
    const { genre, sort } = req.query;
    //on frontend axios.get('/api/books?genre=poetry&limit=40')
    let orderBy: any = { createdAt: "desc" }; //query parameter
    switch (sort) {
      case "trending":
        orderBy = { ratingSum: "desc" };
        //descending order of rating logic kinda weird bt temporary
        break;
      case "mostLiked":
        orderBy = { ratingSum: "desc" };
        break;
      case "newArrival":
        orderBy = { createdAt: "desc" };
        break;
    }

    //for search by genre
    const where: any = {};
    if (genre) where.genre = genre as string;

    const books = await prisma.book.findMany({
      where,
      include: {
        writer: true,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "getBooks controller error",
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
