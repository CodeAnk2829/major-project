import Router from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { CreateComplaintSchema } from "../types/complaint";
import { authMiddleware, authorizeMiddleware } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

enum Role {
    FACULTY = "FACULTY",
    STUDENT = "STUDENT",
    ADMIN = "ADMIN"
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
                        pickedBy: issueIncharge.inchargeId,
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
                        incharge: {
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
            access: complaintResponse.access,
            postAsAnonymous: complaintResponse.postAsAnonymous,
            userName: complaintResponse.user.name,
            userId: complaintResponse.user.id,
            status: complaintResponse.status,
            inchargeId: issueIncharge.inchargeId,
            inchargeName: complaintResponse.complaintDetails?.incharge.name,
            inchargeDesignation: complaintResponse.complaintDetails?.incharge.issueIncharge?.designation,
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

// upvote a complaint
router.post("/upvote/:id", authMiddleware, authorizeMiddleware(Role), async (req: any, res: any) => {
    try {
        const complaintId: string = req.params.id;
        const userId: string = req.user.id;

        if (!userId) {
            throw new Error("Unauthorized");
        }

        if (!complaintId) {
            throw new Error("No complaint id provided");
        }
        // first check an user has already upvoted
        const hasUpvoted = await prisma.upvote.findFirst({
            where: { userId, complaintId },
            select: { id: true }
        });

        let finalAction: any;

        if (!hasUpvoted) {
            const addUpvote = await prisma.upvote.create({
                data: {
                    userId,
                    complaintId
                },
            });

            if (!addUpvote) {
                throw new Error("Could not upvote. Please try again");
            }
            finalAction = { increment: 1 };
        } else {
            const removeUpvote = await prisma.upvote.delete({
                where: {
                    id: hasUpvoted.id
                }
            });

            if (!removeUpvote) {
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

        if (!totalUpvotes) {
            throw new Error("Could not count total upvotes for the complaint");
        }

        res.status(200).json({
            ok: true,
            upvotes: totalUpvotes.upvotes,
            hasUpvoted: hasUpvoted ? false : true
        });
    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while voting"
        });
    }
});

// get all complaints
router.get("/get-all", authMiddleware, authorizeMiddleware(Role), async (req: any, res: any) => {
    try {
        const userId = req.user.id;

        if(!userId) {
            throw new Error("Unauthorized");
        }

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
                        incharge: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                issueIncharge: {
                                    select: {
                                        designation: true,
                                        location: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if(!complaints) {
            throw new Error("An error occurred while fetching complaints");
        }

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

        // all upvoted complaints by the currently logged in user
        const upvotedComplaints = await prisma.upvote.findMany({
            where: {
                userId
            },
            select: {
                complaintId: true
            }
        });

        res.status(200).json({
            ok: true,
            complaintResponse,
            upvotedComplaints
        });

    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while fetching complaints"
        });
    }
});

// get an user's complaints
router.get("/get-user/:id", authMiddleware, authorizeMiddleware(Role), async (req: any, res: any) => {
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
                        incharge: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                issueIncharge: {
                                    select: {
                                        designation: true,
                                        location: true,
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

        // get all upvoted complaints by this user
        const upvotedComplaints = await prisma.upvote.findMany({
            where: {
                userId
            },
            select: {
                complaintId: true
            }
        });

        res.status(200).json({
            ok: true,
            complaints,
            upvotedComplaints,
        });
    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while fetching complaints"
        });
    }
});

// get a complaint by id
router.get("/get-complaint/:id", authMiddleware, authorizeMiddleware(Role), async (req: any, res: any) => {
    try {
        const userId = req.user.id;
        const complaintId = req.params.id;

        if (!userId) {
            throw new Error("Unauthorized");
        }

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
                                id: true,
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
                        incharge: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                issueIncharge: {
                                    select: {
                                        designation: true,
                                        location: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!complaint) {
            throw new Error("Could not fetch the required complaint");
        }

        const upvote = await prisma.upvote.findFirst({
            where: { userId, complaintId },
            select: { id: true }
        });

        let hasUpvoted: boolean = false;

        if (upvote) {
            hasUpvoted = true;
        }

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

        const location = complaintResponse.complaintDetails?.incharge.issueIncharge?.location.location;
        const locationName = complaintResponse.complaintDetails?.incharge.issueIncharge?.location.locationName;
        const locationBlock = complaintResponse.complaintDetails?.incharge.issueIncharge?.location.locationBlock;

        res.status(201).json({
            ok: true,
            message: "Complaint created successfully",
            complaintId: complaintResponse.id,
            title: complaintResponse.title,
            description: complaintResponse.description,
            access: complaintResponse.access,
            postAsAnonymous: complaintResponse.postAsAnonymous,
            userName: complaintResponse.user.name,
            userId: complaintResponse.user.id,
            hasUpvoted,
            status: complaintResponse.status,
            inchargeId: complaintResponse.complaintDetails?.incharge.id,
            inchargeName: complaintResponse.complaintDetails?.incharge.name,
            inchargeDesignation: complaintResponse.complaintDetails?.incharge.issueIncharge?.designation,
            location: `${location}-${locationName}-${locationBlock}`,
            upvotes: complaintResponse.complaintDetails?.upvotes,
            actionTaken: complaintResponse.complaintDetails?.actionTaken,
            attachments: complaintResponse.attachments,
            tags: complaintResponse.tags,
            createdAt: complaintResponse.createdAt,
        });
    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while fetching complaint"
        });
    }
});

// update a complaint
router.put("/update/:id", authMiddleware, authorizeMiddleware(Role), async (req: any, res: any) => {
    try {
        const body = req.body; // { title: string, description: string, access: string, postAsAnonymous: boolean, location: string, tags: int[], attachments: string[] }
        const parseData = CreateComplaintSchema.safeParse(body);
        const complaintId = req.params.id;
        const currentUserId = req.user.id;

        if (!parseData.success) {
            throw new Error("Invalid Inputs");
        }

        const doesComplaintBelongToLoggedInUser = await prisma.complaint.findUnique({
            where: { id: complaintId },
            select: {
                userId: true,
                status: true,
                complaintDetails: {
                    select: {
                        incharge: {
                            select: {
                                issueIncharge: {
                                    select: {
                                        location: {
                                            select: {
                                                location: true, 
                                                locationName: true,
                                                locationBlock: true,
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        
        if(!doesComplaintBelongToLoggedInUser) {
            throw new Error("No complaint exist with this given id");
        }
        
        // if status is pending then don't let an user to update the complaint details
        if(doesComplaintBelongToLoggedInUser.status !== "PENDING") {
            throw new Error("Complaint is already picked up. You cannot update the complaint details");
        }

        // check whether the complaintId belongs to the current user
        if(doesComplaintBelongToLoggedInUser.userId !== currentUserId) {
            throw new Error("Access Denied. You do not have permissions to make changes for this complaint.");
        }
        
        const currentLocationDetails = doesComplaintBelongToLoggedInUser.complaintDetails?.incharge.issueIncharge?.location;
        const currentLocation = `${currentLocationDetails?.location}-${currentLocationDetails?.locationName}-${currentLocationDetails?.locationBlock}`

        let tagData: any[] = [];
        let attachmentsData: any[] = [];
        
        parseData.data.tags.forEach(id => {
            tagData.push({ tagId: Number(id) });
        });

        parseData.data.attachments.forEach(url => {
            attachmentsData.push({ imageUrl: url });
        });
        
        let dataToUpdate: any = {
            title: parseData.data.title,
            description: parseData.data.description,
            access: parseData.data.access,
            postAsAnonymous: parseData.data.postAsAnonymous,
            tags: {
                deleteMany: [{ complaintId }], // delete existing tags 
                create: tagData // then create new tags which is given by the user
            },
            attachments: {
                deleteMany: [{ complaintId }], // same as tags
                create: attachmentsData
            },
        }

        // check whether location is same 
        if(currentLocation !== parseData.data.location) {
            const location = parseData.data.location.split("-")[0];
            const locationName = parseData.data.location.split("-")[1];
            const locationBlock = parseData.data.location.split("-")[2];
            
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

            dataToUpdate = { 
                ...dataToUpdate,
                complaintDetails: {
                    update: {
                        pickedBy: issueIncharge.inchargeId,
                    }
                },
            }
        }

        const updateComplaint = await prisma.complaint.update({
            where: { id: complaintId },
            data: dataToUpdate,
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
                        incharge: {
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

        if (!updateComplaint) {
            throw new Error("Could not create complaint. Please try again");
        }

        // check whether this user has upvoted this complaint
        let hasUpvoted: boolean = false;

        const upvote = await prisma.upvote.findFirst({
            where: { userId: currentUserId, complaintId},
            select: { id: true }
        });

        if(upvote) {
            hasUpvoted = true;
        }

        const tagNames = updateComplaint.tags.map(tag => tag.tags.tagName);
        const attachments = updateComplaint.attachments.map(attachment => attachment.imageUrl);

        let complaintResponse = updateComplaint;

        if (updateComplaint.postAsAnonymous) {
            complaintResponse = {
                ...updateComplaint,
                user: {
                    id: updateComplaint.user.id,
                    name: "Anonymous",
                }
            }
        }

        res.status(200).json({
            ok: true,
            message: "Complaint updated successfully",
            complaintId: complaintResponse.id,
            title: complaintResponse.title,
            description: complaintResponse.description,
            access: complaintResponse.access,
            postAsAnonymous: complaintResponse.postAsAnonymous,
            userName: complaintResponse.user.name,
            userId: complaintResponse.user.id,
            hasUpvoted,
            status: complaintResponse.status,
            inchargeId: complaintResponse.complaintDetails?.incharge.id,
            inchargeName: complaintResponse.complaintDetails?.incharge.name,
            inchargeDesignation: complaintResponse.complaintDetails?.incharge.issueIncharge?.designation,
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
            error: err instanceof Error ? err.message : "An error occurred while updating the complaint"
        });
    }
});

// delete a complaint
router.delete("/delete/:id", authMiddleware, authorizeMiddleware(Role), async (req: any, res: any) => {
    try {
        const complaintId = req.params.id;
        const currentUserId = req.user.id;

        // check if current user is the one who created this complaint
        const doesComplaintBelongToLoggedInUser = await prisma.complaint.findUnique({
            where: { id: complaintId },
            select: { userId: true }
        });

        if(!doesComplaintBelongToLoggedInUser) {
            throw new Error("No complaint exist with this given id");
        }

        if(doesComplaintBelongToLoggedInUser.userId !== currentUserId) {
            throw new Error("Access Denied. You do not have permissions to make changes.")
        }

        const deletedComplaint = await prisma.complaint.delete({
            where: { id: complaintId },
            select: { id: true }
        });

        if(!deletedComplaint) {
            throw new Error("Could not delete complaint. Please try again.");
        }

        res.status(200).json({
            ok: true,
            message: "Complaint deleted successfully.",
            complaintId
        });
    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while deleting the complaint."
        });
    }
});

export const complaintRouter = router;