import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth";
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", authRouter);
app.listen(3000, () => console.log("Server is listening to port 3000"));