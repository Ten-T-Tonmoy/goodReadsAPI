import { Router } from "express";

import { listOfBooks, addBook } from "../controllers/book.controller.js";

const router = Router();

//routes part
router.get("/", listOfBooks);
router.get("/add", addBook);

export default router;
