import { z } from "zod";

enum Role {
    ISSUE_INCHARGE = "ISSUE_INCHARGE",
    RESOLVER = "RESOLVER",
}

export const AssignmentSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.nativeEnum(Role),
    location: z.string().min(3),
    designation: z.string().min(3),
});