import { Router } from "express";
import dotenv, { parse } from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { SigninSchema, SignupSchema } from "../types/user";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();
const router = Router();

const secret: string | undefined = process.env.JWT_SECRET;


router.post("/auth/signin", async (req, res) => {
    try {
        const body = req.body; // { email: "" or phoneNumber: "", password: "", role: "" }
        const parseData = SigninSchema.safeParse(body);
        
        if (!parseData.success) {
            throw new Error("Invalid Inputs");
        }

        
        // check if user exists
        let user = null;

        if(parseData.data.email) {
            user = await prisma.user.findUnique({
                where: {
                    email: parseData.data.email,
                },
            });
        } else {
            user = await prisma.user.findFirst({
                where: {
                    phoneNumber: parseData.data.phoneNumber,
                }, 
            });
        }
        
        if (!user) {
            throw new Error("User not found");
        }

        // check if password is correct
        if (!bcrypt.compareSync(parseData.data.password, user.password)) {
            throw new Error("Incorrect Password");
        }

        // check if role is correct
        if (user.role !== parseData.data.role) {
            throw new Error("Authorization Error");
        }

        const userId = user.id;
        const role = user.role;

        const token = jwt.sign({ userId, role }, secret as string);

        // expires in 30 days
        res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });

        res.status(200).json({
            token: token,
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.createdAt
        });
    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An unknown error occurred"
        });
    }
});

router.post("/auth/signup", async (req, res) => {
    try {
        const body = req.body; // { name: string, email: string, phoneNumber: string, password: string, role: string }
        const parseData = SignupSchema.safeParse(body);

        if (!parseData.success) {
            throw new Error("Invalid Inputs");
        }

        // check if user exists
        const isUserExisted = await prisma.user.findFirst({
            where: {
                email: parseData.data.email
            }
        });

        if(isUserExisted) {
            throw new Error("User already exists");
        }

        const password = bcrypt.hashSync(parseData.data.password, 10);

        // store the user's information in the database
        const user = await prisma.user.create({
            data: {
                email: parseData.data.email,
                phoneNumber: parseData.data.phoneNumber,
                password: password,
                name: parseData.data.name,
                role: parseData.data.role as "ADMIN" | "FACULTY" | "STUDENT"
            }
        });

        if(!user) {
            throw new Error("User not created");
        }

        const userId = user.id;
        const role = parseData.data.role;

        const token = jwt.sign({ userId, role }, secret as string);

        res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
        res.status(201).json({
            token: token,
            user: user.id
        });

    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An unknown error occurred"
        });
    }
});

export const userRouter = router;