import { z } from "zod";

enum Role {
    STUDENT = "STUDENT",
    FACULTY = "FACULTY",
    ADMIN = "ADMIN",
    ISSUE_INCHARGE = "ISSUE_INCHARGE",
    RESOLVER = "RESOLVER"
}

export const SignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(3),
    role: z.nativeEnum(Role)
});

export const SigninSchema = z.object({
    email: z.string(),
    password: z.string(),
    role: z.nativeEnum(Role)
});
