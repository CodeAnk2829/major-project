import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const tags = await prisma.tag.createMany({
            data: [
                { tagName: "Hostel" },
                { tagName: "Mess" },
                { tagName: "Department" },
                { tagName: "Cleaning" },
                { tagName: "Sports" },
                { tagName: "Bus Services" },
                { tagName: "Others" }
            ]
        });
    
        if(!tags) {
            throw new Error("Could not create tags");
        }

        console.log("Tags created successfully");
        
        const location = await prisma.location.createMany({
            data: [
                { location: "Hostel", locationName: "10", locationBlock: "A" },
                { location: "Hostel", locationName: "10", locationBlock: "B" },
                { location: "Hostel", locationName: "10", locationBlock: "C" },
                { location: "Hostel", locationName: "10", locationBlock: "D" },
                { location: "Mess", locationName: "12", locationBlock: "A" },
                { location: "Department", locationName: "CSE", locationBlock: "A" },
                { location: "Department", locationName: "CSE", locationBlock: "B" },
            ]
        });

        if(!location) {
            throw new Error("Could not create locations");
        }
        console.log("Locations created successfully");

    } catch(err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
} 

main();