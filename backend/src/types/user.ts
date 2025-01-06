import { z } from "zod";

enum Role {
    COMPLAINER = "COMPLAINER",
    ADMIN = "ADMIN",
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
