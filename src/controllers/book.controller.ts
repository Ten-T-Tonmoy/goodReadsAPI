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

//if scalar or array field then where:{genre:{has:genreEl}}

/**
 * has->scalar list  for >> string[]   where :{has:element}
 * hasSome-> scalar list >> string[]  where :{has:["action","drama"]}
 * 
 * some -> for one2m or M2M relations >> Author[]--------------------------
 * where: {
  writer: {
    some: {
      id: { in: ["author1", "author2"] }
    }
  }
}
  for where book written by either one
 */

//---------------------------------get Each Book-------------------------

export const getBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // use this since endpoint

    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        writer: true,
        review: {
          include: { reviewer: true },
          orderBy: { createdAt: "desc" }, // can be filtered in diff ways
        },
        likedBy: true,
        _count: {
          select: { likedBy: true, review: true }, //num of reviews and likes
        },
      },
    });

    if (!book) {
      return res.json(404).json({
        success: false,
        error: "Book not found! Invalid credentials",
      });
    }

    //suggested by writer
    const writerIds = book.writer.map((el) => el.id);

    const suggestedBooksBySameWriter = await prisma.book.findMany({
      where: {
        id: { not: book.id },
        writer: {
          some: { id: { in: writerIds } },
          //many to many shit
        },
      },
      orderBy: { ratingNumber: "desc" },
      take: 5,
    });

    //suggested by genre

    const suggestedBooksBySameGenre = await prisma.book.findMany({
      where: {
        genre: { hasSome: book.genre },
      },
      orderBy: { ratingNumber: "desc" },
      take: 5,
    });

    const BookSuggestionSupreme = await prisma.book.findMany({
      //nested clankiest query ever
      where: {
        AND: [
          { id: { not: book.id } },
          {
            OR: [
              {
                genre: {
                  hasSome: book.genre,
                },
              },
              {
                keywords: { hasSome: book.keywords },
              },
            ],
          },
        ],
      },
      include: {
        writer: true,
        _count: {
          select: { likedBy: true },
        },
      },
      take: 10,
      orderBy: {
        ratingNumber: "desc", //modular
      },
    });

    res.json({
      success: true,
      data: {
        book,
        suggestedBooksBySameGenre,
        suggestedBooksBySameWriter,
        BookSuggestionSupreme,
        avgRating: book.ratingSum > 0 ? book.ratingSum / book.ratingNumber : 0,
      },
    });
    //final res send
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
