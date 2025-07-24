import { Router } from "express";

import { addAuthor } from "../controllers/author.controller";
import fs from "fs";
import { upload } from "../config/multer.config";

const router = Router();

//for multiple files upload.fiels
router.post(
  "/add",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 },
  ]),
  addAuthor
);

//http://localhost:3000/api/authors/:id check

export default router;
