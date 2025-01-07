import { Router } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { AssignmentSchema } from "../types/assignment";

const prisma = new PrismaClient();
const router = Router();


router.post("/assign/incharge", async (req, res) => {
    try {
        const body = req.body; // { name: String, email: String, password: String, role: String, location: String, designation: String }
        const parseData = AssignmentSchema.safeParse(body);

        if(!parseData.success) {
            throw new Error("Invalid Inputs");
        }

        // check for existing user
        const isUserExisted = await prisma.user.findFirst({
            where: {
                email: parseData.data.email
            }
        });

        if(isUserExisted) {
            throw new Error("User already exists");
        }

        const password = bcrypt.hashSync(parseData.data.password, 10);
        const location: string | undefined = parseData.data.location?.split("-")[0];
        const locationName = parseData.data.location?.split("-")[1];
        const locationBlock = parseData.data.location?.split("-")[2];
        
        // find least ranked incharge so far
        let rankOfNewIncharge = 1;

        const newIncharge = await prisma.$transaction(async (tx) => {
            const leastRank = await tx.issueIncharge.findFirst({
                where: {
                    location: {
                        location: location as string,
                        locationName: locationName as string,
                        locationBlock: locationBlock as string    
                    }
                },
                orderBy: {
                    rank: "desc"
                },
            });
    
            if(leastRank) {
                rankOfNewIncharge = leastRank.rank + 1;
            }

            const isLocationFound = await tx.location.findFirst({
                where: {
                    location: location as string,
                    locationName: locationName as string,
                    locationBlock: locationBlock as string
                }, 
                select: {
                    id: true
                }
            });
            
            if(!isLocationFound) {
                throw new Error("Could not find the location. Please try again.");
            }
    
            const user = await tx.user.create({
                data: {
                    name: parseData.data.name,
                    email: parseData.data.email,
                    password: password,
                    role: parseData.data.role as "ISSUE_INCHARGE",
                    issueIncharge: {
                        create: {
                            locationId: isLocationFound.id,
                            rank: rankOfNewIncharge,
                            designation: parseData.data.designation,
                        },
                    },
                },
            });
            
            if(!user) {
                throw new Error("Could not create new user. Please try again.");
            }
            return user;
        });

        if(!newIncharge) {
            throw new Error("Could not create new incharge. Please try again.");
        }

        res.status(201).json({
            ok: true,
            message: "Incharge assigned successfully",
            incharge: newIncharge.id
        }); 
    } catch(err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while assigning incharge. Please try again."
        });
    }
});

export const adminRouter = router;