import { Router } from "express";
import {
  addBook,
  getBookById,
  getBooksHomePage,
} from "../controllers/book.controller.js";

const router = Router();

router.get("/home", getBooksHomePage);
router.get("/:id", getBookById);
router.post("/add", addBook);

//http://localhost:3000/api/home?genre=poetry&sort=trending check

export default router;
