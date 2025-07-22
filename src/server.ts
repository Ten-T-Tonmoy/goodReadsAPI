import express from "express";
import dotenv from "dotenv";
import { Request, Response, Express } from "express";
import path from "path";
import { fileURLToPath } from "url";
import corsOption from "./config/cors.config.js";
import cors from "cors";
//used concurrently and rimraf on script

export const app: Express = express();
const PORT: number = parseInt(process.env.PORT || "3000");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); //views loc
//middleware >>app.use(middleware) runs for everyRequest |  app.set(key,val)
app.use(express.static(path.join(__dirname, "../public"))); //static file serve from this folder damn pain for css
//app.use("/endpoint",middleware) will only run for this endpoint

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOption));

app.get("/test", (req: Request, res: Response) => {
  res.send("its goin up broh");
});

//route handling
import bookRouter from "./routes/books.routes.js";
app.use("/api/books", bookRouter);

//uploader shits

app.listen(PORT, () => {
  console.log(`Connected to port ${PORT}`);
});
