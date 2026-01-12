import { Id } from "@/convex/_generated/dataModel";
import z from "zod";

export const CommentSchema = z.object({
    body: z.string(),
    postId: z.custom<Id<"posts">>(),
});
