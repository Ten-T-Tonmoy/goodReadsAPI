import { Router } from "express";
import { getBooksHomePage } from "../controllers/book.controller.js";

const router = Router();

router.get("/home", getBooksHomePage);
//http://localhost:3000/api/home?genre=poetry&sort=trending check

export default router;
