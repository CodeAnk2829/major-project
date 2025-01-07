import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user";
import { complaintRouter } from "./routes/complaint";
import { adminRouter } from "./routes/admin";
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/complaint", complaintRouter);
app.use("/api/v1/user", userRouter);

app.listen(3000, () => console.log("Server is listening to port 3000"));