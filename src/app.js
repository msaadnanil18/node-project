import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/userRouter.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", router);

export { app };
