import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, callBack) {
    callBack(null, path.join(process.cwd(), "./public/temp"));
  },
  filename: function (req, file, callback) {
    const diffSuffix = `${Date.now()}-${file.originalname}`;
    callback(null, diffSuffix); //unique huh
  },
});

export const upload = multer({
  storage: storage,
  limits:{
    fileSize:50*1024*1024 //50 mb at peak
  },
  
}); //dependency injection
