import { Router } from "express";

import { addAuthor } from "../controllers/author.controller";
import fs from "fs";

const router = Router();

router.get("/add");

//http://localhost:3000/api/authors/:id check

export default router;
