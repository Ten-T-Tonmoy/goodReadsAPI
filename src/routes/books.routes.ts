import { Router } from "express";
import {
  addBook,
  getBookById,
  getBooksHomePage,
} from "../controllers/book.controller.js";

const bookRouter = Router();

bookRouter.get("/home", getBooksHomePage);
bookRouter.get("/:id", getBookById); // bruh no return why tf
//either Promise<void> or void return handlers return type so year
bookRouter.post("/add", addBook);

//http://localhost:3000/api/home?genre=poetry&sort=trending check

export default bookRouter;
