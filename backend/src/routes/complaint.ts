import Router from "express";
import { PrismaClient } from "@prisma/client";
import { CreateComplaintSchema } from "../types/complaint";
import { authMiddleware, authorizeMiddleware } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

enum Role {
    FACULTY = "FACULTY",
    STUDENT = "STUDENT",
}

router.post("/create", authMiddleware, authorizeMiddleware(Role), async (req: any, res: any) => {
    try {
        const body = req.body; // { title: string, description: string, access: string, location: string, tags: int[], attachments: string[] }
        const parseData = CreateComplaintSchema.safeParse(body);

        if (!parseData.success) {
            throw new Error("Invalid Inputs");
        }

        const location = parseData.data.location.split("-")[0];
        const locationName = parseData.data.location.split("-")[1];
        const locationBlock = parseData.data.location.split("-")[2];

        let tagData: any[] = [];
        let attachmentsData: any[] = [];

        parseData.data.tags.forEach(id => {
            tagData.push({ tagId: Number(id) });
        });

        parseData.data.attachments.forEach(url => {
            attachmentsData.push({ imageUrl: url });
        });

        // search for a particular tag which is important such as 'Hostel' out of all tags
        const mainTag = location;
        let complaintId = null;

        // find the least ranked incharge of the hostel of the given location
        const issueIncharge = await prisma.issueIncharge.findFirst({
            where: {
                location: { location, locationName, locationBlock }
            },
            orderBy: {
                rank: "desc"
            },
            select: {
                inchargeId: true,
                locationId: true
            }
        });

        if (!issueIncharge) {
            throw new Error("No incharge found for the given location");
        }
        
        const createComplaint = await prisma.complaint.create({
            data: {
                title: parseData.data.title,
                description: parseData.data.description,
                access: parseData.data.access,
                complaintDetails: {
                    create: {
                        assignedTo: issueIncharge.inchargeId,
                    }
                },
                userId: req.user.id,
                status: "PENDING",
                tags: {
                    create: tagData
                },
                attachments: {
                    create: attachmentsData
                },
            }
        });

        if (!createComplaint) {
            throw new Error("Could not create complaint. Please try again");
        }
        complaintId = createComplaint.id;

        res.status(201).json({
            ok: true,
            message: "Complaint created successfully",
            complaintId
        });
    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while creating the complaint"
        });
    }
});

export const complaintRouter = router;