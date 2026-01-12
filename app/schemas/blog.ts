import z from "zod";

export const BlogSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters long"),
    body: z.string().min(20, "Content must be at least 20 characters long"),
    Image: z.instanceof(File),
});
