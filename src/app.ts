//might not be used
import app from "./server";
import fs from "fs";
import cloudinary from "./config/cloudinary.config";
import { cloudinaryUploader } from "./config/cloudinary.config";
import { upload } from "./config/multer.config";
import { Request, Response } from "express";
app.post("/upload", upload.single("file"), cloudinaryUploader);
