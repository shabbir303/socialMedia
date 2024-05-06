import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dontenv from "dotenv";
import multer from "multer";
import helmet, { crossOriginResourcePolicy } from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import {register} from "./contollers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";

/* configuration */
const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);
dontenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet(crossOriginResourcePolicy({policy:"cross-origin"})));
app.use(morgan("common"));
app.use(bodyParser.json({limit:"30mb", extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb", extended:true}));
app.use(cors());
app.use("/assests",express.static(path.join(__dirname, "public/assests")));

/* File Storage */
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/assests");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({storage});

/* Routes with files */
app.post("/auth/register", upload.single("picture"), register); //upload.single("picture") is a middleware

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

/* Database Connection
shabbir
6G04EgyaTZCyK9QL
*/
const PORT = process.env.PORT || 3002;
console.log(process.env.MONGO_URL, 1);
mongoose
.connect(process.env.MONGO_URL,{
    dbName: "social"
})
.then(()=>{
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((error)=>{console.log(`${error} did not connect to database`)});