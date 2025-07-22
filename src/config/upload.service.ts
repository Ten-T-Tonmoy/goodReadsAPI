import { cloudinaryUploader } from "./cloudinary.config.js";
import { upload } from "./multer.config.js";
import { app } from "../server.js";
import { Request, Response } from "express";

interface MulterRequest extends Request {
  file: Express.Multer.File;
}
app.post(
  "/upload",
  upload.single("file"), //upload is the Multer dependency injected
  async (req: Request, res: Response) => {
    try {
      const filePath = req.file?.path;
      const gottenResponse = await cloudinaryUploader(filePath);
      if (!gottenResponse) {
        res.status(500).json({
          success: false,
          message: "",
        });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({
        success: false,
        message: "upload failed man",
      });
    }
  }
);

app.get("/upload-test", (req: Request, res: Response) => {
  res.render("uploader");
  // res.json({ message: "its goin down" });
});

/**
 * to use the multer and cloudinary shit
 *  import upload->single on Local Storage->returns path
 *  import cloudinaryUploader ->url
 * 
 * 
 * fs.unlikSync(path)
 */
