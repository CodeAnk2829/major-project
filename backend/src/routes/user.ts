import Router from "express";

const router = Router();

router.post("/complaint/create", async (req, res) => {
    try {
        const body = req.body; // { title: string, description: string, access: string, tags: string[], attachments: string[] }
    } catch(err) {
        res.status(400).json({
            ok: false,
            error: err instanceof Error ? err.message : "An error occurred while creating the complaint"
        });
    }
});

export const userRouter = router;