import prisma from "../prisma.js";
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
        orderBy = {
          ratingSum: "desc",
        };
        break;
      case "newArrival":
        orderBy = { createdAt: "desc" };
        break;
    }

    //for search by genre
    const where: any = {};
    const genreString = typeof genre === "string" ? genre : undefined;
    if (genreString) where.genre = { has: genreString }; //being safe?
    //it worked undefined caused error!
    //book fetch
    const books = await prisma.book.findMany({
      where,
      include: {
        writer: true,
        likedBy: true,
        _count: {
          select: {
            likedBy: true, //return likedBy:25
            review: true,
          },
        },
        //just need to include scalar fields others auto goes
      },
      orderBy,
      take: 40,
    });

    res.json({
      success: true,
      data: books,
      meta: {
        total: books.length,
        genre: genre || "all",
        sort: sort || "newArrival",
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
