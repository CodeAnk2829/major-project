import Router from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { CreateComplaintSchema } from "../types/complaint";
import { authMiddleware, authorizeMiddleware } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

enum Role {
    FACULTY = "FACULTY",
    STUDENT = "STUDENT",
}

// create a complaint
router.post("/create", authMiddleware, authorizeMiddleware(Role), async (req: any, res: any) => {
    try {
        const body = req.body; // { title: string, description: string, access: string, postAsAnonymous: boolean, location: string, tags: int[], attachments: string[] }
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
                postAsAnonymous: parseData.data.postAsAnonymous,
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
            },
            include: {
                attachments: {
                  select: {
                    id: true,
                    imageUrl: true
                  }  
                },
                tags: {
                    select: {
                        tags: {
                            select: {
                                tagName: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                complaintDetails: {
                    select: {
                        upvotes: true,
                        actionTaken: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                issueIncharge: {
                                    select: {
                                        designation: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!createComplaint) {
            throw new Error("Could not create complaint. Please try again");
        }

        const tagNames = createComplaint.tags.map(tag => tag.tags.tagName);
        const attachments = createComplaint.attachments.map(attachment => attachment.imageUrl);

        let complaintResponse = createComplaint;

        if (createComplaint.postAsAnonymous) {
            complaintResponse = {
                ...createComplaint,
                user: {
                    id: createComplaint.user.id,
                    name: "Anonymous",
                }
            }
        }

        res.status(201).json({
            ok: true,
            message: "Complaint created successfully",
            complaintId: complaintResponse.id,
            title: complaintResponse.title,
            description: complaintResponse.description,
            userName: complaintResponse.user.name,
            userId: complaintResponse.user.id,
            status: complaintResponse.status,
            inchargeId: issueIncharge.inchargeId,
            inchargeName: complaintResponse.complaintDetails?.user.name,
            inchargeDesignation: complaintResponse.complaintDetails?.user.issueIncharge?.designation,
            location: parseData.data.location, 
            upvotes: complaintResponse.complaintDetails?.upvotes,
            actionTaken: complaintResponse.complaintDetails?.actionTaken,
            attachments: attachments,
            tags: tagNames,
            createdAt: complaintResponse.createdAt
        });
    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while creating the complaint"
        });
    }
});

// get all complaints
router.get("/all", authMiddleware, authorizeMiddleware(Role), async (req: any, res: any) => {
    try {
        const complaints = await prisma.complaint.findMany({
            where: {
                access: "PUBLIC"
            }, 
            orderBy: {
                createdAt: "desc" // get recent complaints first
            },
            include: {
                attachments: {
                    select: {
                        id: true,
                        imageUrl: true
                    }
                },
                tags: {
                    select: {
                        tags: {
                            select: {
                                tagName: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                complaintDetails: {
                    select: {
                        upvotes: true,
                        actionTaken: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                issueIncharge: {
                                    select: {
                                        designation: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        let complaintResponse: any = [];
        complaints.forEach((complaint: any) => {
            if (complaint.postAsAnonymous) {
                complaintResponse.push({
                    ...complaint,
                    user: {
                        id: complaint.user.id,
                        name: "Anonymous",
                    }
                });
            } else {
                complaintResponse.push(complaint);
            }
        });

        res.status(200).json({
            ok: true,
            complaintResponse
        });

    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while fetching complaints"
        });
    }
});

// get complaint by id
router.get("/:id", authMiddleware, authorizeMiddleware(Role), async (req: any, res: any) => {
    try {
        const complaintId = req.params.id;
        const complaint = await prisma.complaint.findUnique({
            where: {
                id: complaintId
            },
            include: {
                attachments: {
                    select: {
                        id: true,
                        imageUrl: true
                    }
                },
                tags: {
                    select: {
                        tags: {
                            select: {
                                tagName: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                complaintDetails: {
                    select: {
                        upvotes: true,
                        actionTaken: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                issueIncharge: {
                                    select: {
                                        location: {
                                            select: {
                                                location: true,
                                                locationName: true,
                                                locationBlock: true
                                            }
                                        },
                                        designation: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        // TODO: send attachments, user-details based on anonymity, tags

        if(!complaint) {
            throw new Error("Could not fetch the required complaint");
        }

        const tagNames = complaint.tags.map(tag => tag.tags.tagName);
        const attachments = complaint.attachments.map(attachment => attachment.imageUrl);

        let complaintResponse = complaint;

        if (complaint.postAsAnonymous) {
            complaintResponse = {
                ...complaint,
                user: {
                    id: complaint.user.id,
                    name: "Anonymous",
                }
            }
        }

        const location = complaintResponse.complaintDetails?.user.issueIncharge?.location.location;
        const locationName = complaintResponse.complaintDetails?.user.issueIncharge?.location.locationName;
        const locationBlock = complaintResponse.complaintDetails?.user.issueIncharge?.location.locationBlock;

        res.status(201).json({
            ok: true,
            message: "Complaint created successfully",
            complaintId: complaintResponse.id,
            title: complaintResponse.title,
            description: complaintResponse.description,
            userName: complaintResponse.user.name,
            userId: complaintResponse.user.id,
            status: complaintResponse.status,
            inchargeId: complaintResponse.complaintDetails?.user.id,
            inchargeName: complaintResponse.complaintDetails?.user.name,
            inchargeDesignation: complaintResponse.complaintDetails?.user.issueIncharge?.designation,
            location: `${location}-${locationName}-${locationBlock}`,
            upvotes: complaintResponse.complaintDetails?.upvotes,
            actionTaken: complaintResponse.complaintDetails?.actionTaken,
            attachments: attachments,
            tags: tagNames,
            createdAt: complaintResponse.createdAt
        });
    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while fetching complaint"
        });
    }
});

// get an user's complaints
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
            }, 
            orderBy: {
                createdAt: "desc" // get recent complaints first
            },
            include: {
                attachments: {
                    select: {
                        id: true,
                        imageUrl: true
                    }
                },
                tags: {
                    select: {
                        tags: {
                            select: {
                                tagName: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                complaintDetails: {
                    select: {
                        upvotes: true,
                        actionTaken: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                issueIncharge: {
                                    select: {
                                        designation: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if(!complaints) {
            throw new Error("No complaints found for the given user");
        }

        // TODO: send attachments, user-details based on anonymity, tags

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

// upvote a complaint
router.post("/upvote/:id", authMiddleware, authorizeMiddleware(Role), async (req: any, res: any) => {
    try {
        const complaintId = req.params.id;
        const userId = req.user.id;

        if(!userId) {
            throw new Error("Unauthorized");
        }

        // first check an user has already upvoted
        const isUpvoted = await prisma.upvote.findUnique({
            where: { userId, complaintId },
            select: { id: true }
        });

        let finalAction: any;
        
        if(!isUpvoted) {
            const addUpvote = await prisma.upvote.create({
                data: { userId, complaintId },
            });

            if(!addUpvote) {
                throw new Error("Could not upvote. Please try again");
            }
    
            finalAction = { increment: 1 };
        } else {
            const removeUpvote = await prisma.upvote.delete({
                where: { userId }
            });

            if(!removeUpvote) {
                throw new Error("Could not remove upvote. Please try again");
            }
        
            finalAction = { decrement: 1 };
        }

        // count total upvotes for a complaint
        const totalUpvotes = await prisma.complaintDetail.update({
            where: { complaintId },
            data: {
                upvotes: finalAction
            },
            select: {
                upvotes: true
            }
        });

        if(!totalUpvotes) {
            throw new Error("Could not count total upvotes for the complaint");
        }

        res.status(200).json({
            ok: true,
            upvotes: totalUpvotes.upvotes,
            isUpvoted: isUpvoted ? false : true
        });
    } catch (err) {
        res.json(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while voting"
        });
    }
});



export const complaintRouter = router;