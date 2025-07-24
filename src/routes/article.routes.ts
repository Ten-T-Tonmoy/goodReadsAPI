import { Router } from "express";

import { upload } from "../config/multer.config";
import { Response, Request } from "express";

const router = Router();

//for multiple files upload.fiels

router.get("/articles/check", (res: Response, req: Request) => {
  res.send(" articles router handler up");
});

//http://localhost:3000/api/articles/:id check

export default router;
