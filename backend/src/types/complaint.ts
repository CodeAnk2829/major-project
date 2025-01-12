import { z } from "zod";

enum Access {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
}

export const CreateComplaintSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(3),
    access: z.nativeEnum(Access),
    postAsAnonymous: z.boolean(),
    location: z.string().min(3),
    tags: z.array(z.number()),
    attachments: z.array(z.string())
});