import Router from "express";
import { PrismaClient } from "@prisma/client";
import { CreateComplaintSchema } from "../types/complaint";

const prisma = new PrismaClient();
const router = Router();

router.post("/create", async (req, res) => {
    try {
        const body = req.body; // { title: string, description: string, access: string, location: string, tags: string[], attachments: string[] }
        const parseData = CreateComplaintSchema.safeParse(body);

        if(!parseData.success) {
            throw new Error("Invalid Inputs");
        }

        const hostelNumber = parseData.data.location.split("-")[0];
        const hostelBlock = parseData.data.location.split("-")[1];

        console.log(hostelNumber, hostelBlock);
        
        // search for a particular tag which is important such as 'Hostel' out of all tags
        const mainTag = parseData.data.tags.find((tag) => tag === "Hostel");

        // switch(mainTag) {
        //     case "Hostel":
        //         // find the least ranked incharge of the hostel of the given location
        //         const incharge = await prisma.hostel.findFirst({
        //             where: {
        //                 hostelNumber: parseInt(hostelNumber),
        //                 block: hostelBlock
        //             },
        //             orderBy: {
        //                 rank: "desc"
        //             }
        //         });

        //         if(!incharge) {
        //             throw new Error("Could not find the incharge of the hostel");
        //         }

        //         console.log(incharge);
        //         break;

        //     default:
        //         throw new Error("Invalid tag");
        // }

        res.status(201).json({
            ok: true,
            message: "Complaint created successfully"
        });
    } catch(err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while creating the complaint"
        });
    }
});

export const complaintRouter = router;