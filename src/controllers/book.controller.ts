import { Request, Response } from "express";
import { getAllBooks } from "../services/bookList.service.js";
import prisma from "../prisma.js";

export const listOfBooks = async (req: Request, res: Response) => {
  const books = await getAllBooks();
  res.render("books", { books }); //view index page will show
};

export const addBook = async (req: Request, res: Response) => {
  const newBook = await prisma.books.create({
    data: {
      title: "new book",
      number: 5,
    },
  });
  console.log(newBook);
  res.status(200).json(newBook);
};
