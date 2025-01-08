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

        res.status(201).json({
            ok: true,
            message: "Complaint created successfully",
            complaintId: createComplaint.id,
            status: createComplaint.status,
            assignedTo: issueIncharge.inchargeId,
            location: parseData.data.location,
            createdAt: createComplaint.createdAt
        });
    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while creating the complaint"
        });
    }
});

router.get("/all", authMiddleware, authorizeMiddleware(Role), async (req: any, res: any) => {
    try {
        const complaints = await prisma.complaint.findMany({
            where: {
                access: "PUBLIC"
            }
        });

        res.status(200).json({
            ok: true,
            complaints
        });
    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while fetching complaints"
        });
    }
});

router.get("/:id", authMiddleware, authorizeMiddleware(Role), async (req: any, res: any) => {
    try {
        const complaintId = req.params.id;
        const complaint = await prisma.complaint.findUnique({
            where: {
                id: complaintId
            }
        });

        res.status(200).json({
            ok: true,
            complaint
        });
    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while fetching complaint"
        });
    }
});

router.get("/user/:id", authMiddleware, authorizeMiddleware(Role), async (req: any, res: any) => {
    try {
        const userId = req.params.id;
        const loggedInUserId = req.user.id;

        // check whether the loggedIn user id and the requested user id are same
        if (userId !== loggedInUserId) {
            throw new Error("Unauthorized");
        }

        const complaints = await prisma.complaint.findMany({
            where: {
                userId
            }
        });

        if(!complaints) {
            throw new Error("No complaints found for the given user");
        }

        res.status(200).json({
            ok: true,
            complaints
        });
    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while fetching complaints"
        });
    }
});

export const complaintRouter = router;