import { Router } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { InchargeSchema, RemoveSchema, UpdateInchargeSchema } from "../types/admin";
import { authMiddleware, authorizeMiddleware } from "../middleware/auth";
import { parse } from "dotenv";

const prisma = new PrismaClient();
const router = Router();

enum Role {
    ADMIN = "ADMIN"
}

router.post("/assign/incharge", authMiddleware, authorizeMiddleware(Role), async (req, res) => {
    try {
        const body = req.body; // { name: String, email: String, phoneNumber: string, password: String, role: String, location: String, designation: String, rank: Number }
        const parseData = InchargeSchema.safeParse(body);

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
        const location = parseData.data.location?.split("-")[0];
        const locationName = parseData.data.location?.split("-")[1];
        const locationBlock = parseData.data.location?.split("-")[2];
        const rank = parseData.data.rank;

        const newIncharge = await prisma.$transaction(async (tx) => {
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
                    phoneNumber: parseData.data.phoneNumber,
                    password: password,
                    role: parseData.data.role as "ISSUE_INCHARGE",
                    issueIncharge: {
                        create: {
                            locationId: isLocationFound.id,
                            rank,
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
            inchargeId: newIncharge.id,
            name: newIncharge.name,
            email: newIncharge.email,
            phoneNumber: newIncharge.phoneNumber,
            location: location,
            locationName: locationName,
            locationBlock: locationBlock,
            designation: parseData.data.designation,
            rank: parseData.data.rank,
        }); 
    } catch(err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while assigning incharge. Please try again."
        });
    }
});

router.post("/assign/resolver", authMiddleware, authorizeMiddleware(Role), async (req, res) => {
    try {

    } catch(err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while assigning resolver. Please try again."
        });
    }
});
router.get("/get/incharge/:id", authMiddleware, authorizeMiddleware(Role), async (req, res) => {
    try {
        const inchargeId = req.params.id;

        if(!inchargeId) {
            throw new Error("Invalid incharge id.");
        }

        const inchargeDetails = await prisma.user.findFirst({
            where: {
                id: inchargeId
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
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
                        rank: true
                    }
                },
                createdAt: true
            }
        });

        if(!inchargeDetails) {
            throw new Error("Could not fetch incharge details. Please try again.");
        }

        res.status(200).json({
            ok: true, 
            inchargeId: inchargeDetails.id,
            name: inchargeDetails.name,
            email: inchargeDetails.email,
            phoneNUmber: inchargeDetails.phoneNumber,
            location: `${inchargeDetails.issueIncharge?.location.location}-${inchargeDetails.issueIncharge?.location.locationName}-${inchargeDetails.issueIncharge?.location.locationBlock}`,
            designation: inchargeDetails.issueIncharge?.designation,
            rank: inchargeDetails.issueIncharge?.rank,
            createdAt: inchargeDetails.createdAt
        });

    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message: "An error occurred while fetching incharge details. Please try again."
        });
    }
});

router.delete("/remove/incharge/:id", authMiddleware, authorizeMiddleware(Role), async (req, res) => {
    try {
        const inchargeId = req.params.id;

        if(!inchargeId) {
            throw new Error("Invalid incharge id");
        }

        const isRemovalSucceeded = await prisma.user.delete({
            where: {
                id: inchargeId
            }
        });

        if(!isRemovalSucceeded) {
            throw new Error("Could not remove incharge. Please try again.");
        }

        res.status(202).json({
            ok: true, 
            message: "The incharge has been successfully removed.",
        });

    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while removing incharge. Please try again."
        });
    }
});

router.put("/update/incharge/:id", authMiddleware, authorizeMiddleware(Role), async (req, res) => {
    try {
        const inchargeId = req.params.id;
        const body = req.body; // { name: string, email: string, phoneNumber: string, password: string, location: string, designation: string, rank: number }
        const parseData = UpdateInchargeSchema.safeParse(body);

        if(!parseData.success) {
            throw new Error("Invalid inputs");
        }

        const password = bcrypt.hashSync(parseData.data.password, 10);
        const location = parseData.data.location?.split("-")[0];
        const locationName = parseData.data.location?.split("-")[1];
        const locationBlock = parseData.data.location?.split("-")[2];

        const detailsAfterUpdate = await prisma.$transaction(async (tx) => {
            const currentLocation = await tx.location.findFirst({
                where: { location, locationName, locationBlock },
                select: { id: true }
            });

            if(!currentLocation) {
                throw new Error("Could not find the given location.");
            }

            const isUpdateSucceeded = await tx.user.update({
                where: {
                    id: inchargeId
                },
                data: {
                    name: parseData.data.name,
                    email: parseData.data.email,
                    phoneNumber: parseData.data.phoneNumber,
                    password: password,
                    issueIncharge: {
                        update: {
                            designation: parseData.data.designation,
                            rank: parseData.data.rank
                        }
                    }
                }
            });
    
            if(!isUpdateSucceeded) {
                throw new Error("Could not update incharge details. Please try again.");
            }
            return isUpdateSucceeded;
        });

        if(!detailsAfterUpdate) {
            throw new Error("Something went wrong while updating incharge details. Please try again.");
        }

        res.status(200).json({
            ok: true,
            message: "Incharge details updated successfully",
            name: parseData.data.name,
            email: parseData.data.email,
            phoneNumber: parseData.data.phoneNumber,
            location: parseData.data.location,
            designation: parseData.data.designation,
            rank: parseData.data.rank,
        });

    } catch(err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while updating incharge details. Please try again."
        });
    }
});

router.post("/create/tags", authMiddleware, authorizeMiddleware(Role), async (req, res) => {
    try {
        const tags = req.body.tags; // { tags: Array<String> }

        if(tags.length === 0) {
            throw new Error("Invalid inputs");
        }

        const totalTags: any[] = [];

        tags.forEach((tag: string) => {
            totalTags.push({ tagName: tag });
        });

        const newTags = await prisma.tag.createMany({
            data: totalTags
        });

        if(!newTags) {
            throw new Error("Could not create tags. Please try again.");
        }

        res.status(201).json({
            ok: true,
            message: "Tags created successfully",
        });
        
    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while creating tags. Please try again."
        }); 
    }
});

router.post("/create/locations", authMiddleware, authorizeMiddleware(Role), async (req, res) => {
    try {
        const locations = req.body.locations; // { locations: Array<{ location: String, locationName: String, locationBlock: String }> }

        if(locations.length === 0) {
            throw new Error("Invalid inputs");
        }

        const newLocations = await prisma.location.createMany({
            data: locations
        });

        if(!newLocations) {
            throw new Error("Could not create locations. Please try again.");
        }

        res.status(201).json({
            ok: true,
            message: "Locations created successfully",
        });

    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while creating locations. Please try again."
        });
    }
});

router.delete("/remove/tags", authMiddleware, authorizeMiddleware(Role), async (req, res) => {
    try {
        const tags = req.body.tags; // { tags: Array<String> }

        if(tags.length === 0) {
            throw new Error("Invalid inputs");
        }

        const isTagsRemoved = await prisma.tag.deleteMany({
            where: {
                tagName: {
                    in: tags
                }
            }
        });

        if(!isTagsRemoved) {
            throw new Error("Could not remove tags. Please try again.");
        }

        res.status(202).json({
            ok: true,
            message: "Tags removed successfully",
        });

    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while removing tags. Please try again."
        });
    }
});

router.delete("/remove/locations", authMiddleware, authorizeMiddleware(Role), async (req, res) => {
    try {
        const locations = req.body.locations; // { locations: Array<{ location: String, locationName: String, locationBlock: String }> }

        if(locations.length === 0) {
            throw new Error("Invalid inputs");
        }

        const locationsToBeRemoved: any[] = [];

        locations.forEach((loc: any) => {
            locationsToBeRemoved.push({
                location: loc.location,
                locationName: loc.locationName,
                locationBlock: loc.locationBlock
            });
        });

        const isLocationsRemoved = await prisma.location.deleteMany({
            where: {
                AND: [{
                    location: {
                        in: locationsToBeRemoved.map((loc) => loc.location)
                    }
                }, {
                    locationName: {
                        in: locationsToBeRemoved.map((loc) => loc.locationName)
                    }
                }, {
                    locationBlock: {
                        in: locationsToBeRemoved.map((loc) => loc.locationBlock)
                    }
                }]
            }
        });

        if(!isLocationsRemoved) {
            throw new Error("Could not remove locations. Please try again.");
        }

        res.status(202).json({
            ok: true,
            message: "Locations removed successfully",
        });

    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while removing locations. Please try again."
        });
    }
});

router.get("/get/tags", authMiddleware, authorizeMiddleware(Role), async (req, res) => {
    try {
        const tags = await prisma.tag.findMany({});

        if(!tags) {
            throw new Error("Could not fetch tags. Please try again.");
        }

        res.status(200).json({
            ok: true,
            tags: tags.map((tag) => tag.tagName)
        });

    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while fetching tags. Please try again."
        });
    }
});

router.get("/get/locations", authMiddleware, authorizeMiddleware(Role), async (req, res) => {
    try {
        const locations = await prisma.location.findMany({});

        if(!locations) {
            throw new Error("Could not fetch locations.");
        }

        res.status(200).json({
            ok: true,
            locations
        });
    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while fetching locations. Please try again."
        });
    }
});

router.get("/get/incharges", authMiddleware, authorizeMiddleware(Role), async (req, res) => {
    try {
        const incharges = await prisma.user.findMany({
            where: {
                role: "ISSUE_INCHARGE"
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
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
                        rank: true
                    }
                },
                createdAt: true
            }
        });

        if(!incharges) {
            throw new Error("Could not fetch incharges. Please try again.");
        }

        res.status(200).json({
            ok: true,
            incharges: incharges.map((incharge) => ({
                inchargeId: incharge.id,
                name: incharge.name,
                email: incharge.email,
                phoneNumber: incharge.phoneNumber,
                location: `${incharge.issueIncharge?.location.location}-${incharge.issueIncharge?.location.locationName}-${incharge.issueIncharge?.location.locationBlock}`,
                designation: incharge.issueIncharge?.designation,
                rank: incharge.issueIncharge?.rank,
                createdAt: incharge.createdAt
            }))
        });

    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while fetching incharges. Please try again."
        });
    }
});

// router.get("/get/resolvers", authMiddleware, authorizeMiddleware(Role), async (req, res) => {
//     try {
//         const resolvers = await prisma.user.findMany({
//             where: {
//                 role: "RESOLVER"
//             },
//             select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 phoneNumber: true,
//                 resolver: {
//                     select: {
//                         location: {
//                             select: {
//                                 location: true,
//                                 locationName: true,
//                                 locationBlock: true
//                             }
//                         },
//                         designation: true,
//                         rank: true
//                     }
//                 },
//                 createdAt: true
//             }
//         });

//         if(!resolvers) {
//             throw new Error("Could not fetch resolvers. Please try again.");
//         }

//         res.status(200).json({
//             ok: true,
//             resolvers: resolvers.map((resolver) => ({
//                 resolverId: resolver.id,
//                 name: resolver.name,
//                 email: resolver.email,
//                 phoneNumber: resolver.phoneNumber,
//                 location: `${resolver.resolver?.location.location}-${resolver.resolver?.location.locationName}-${resolver.resolver?.location.locationBlock}`,
//                 designation: resolver.resolver?.designation,
//                 rank: resolver.resolver?.rank,
//                 createdAt: resolver.createdAt
//             }))
//         });

//     } catch (err) {
//         res.status(400).json({
//             ok: false,
//             error: err instanceof Error ? err.message : "An error occurred while fetching resolvers. Please try again."
//         });
//     }
// });

router.get("/get/users", authMiddleware, authorizeMiddleware(Role), async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                role: true,
                createdAt: true
            }
        });

        if(!users) {
            throw new Error("Could not fetch users. Please try again.");
        }

        res.status(200).json({
            ok: true,
            users
        });

    } catch (err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while fetching users. Please try again."
        });
    }
});

// admin can view list of all incharges who are working at a particular location
router.get("/get/incharge/:locationId", authMiddleware, authorizeMiddleware(Role), async (req, res) => {
    try {
        const inchargesAtParticularLocation = await prisma.user.findMany({
            where: {
                role: "ISSUE_INCHARGE",
                issueIncharge: {
                    locationId: parseInt(req.params.locationId)
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                issueIncharge: {
                    select: {
                        designation: true,
                        rank: true
                    }
                },
                createdAt: true
            }
        });

        if(!inchargesAtParticularLocation) {
            throw new Error("Could not fetch incharges at a particular location. Please try again.");
        }

        res.status(200).json({
            ok: true,
            incharges: inchargesAtParticularLocation.map((incharge) => ({
                inchargeId: incharge.id,
                name: incharge.name,
                email: incharge.email,
                phoneNumber: incharge.phoneNumber,
                designation: incharge.issueIncharge?.designation,
                rank: incharge.issueIncharge?.rank,
                createdAt: incharge.createdAt
            })),
        });
    } catch(err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while fetching incharges. Please try again."
        });
    }
});


export const adminRouter = router;