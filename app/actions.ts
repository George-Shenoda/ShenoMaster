"use server";

import z from "zod";
import { BlogSchema } from "./schemas/blog";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";
import { updateTag } from "next/cache";
import { Id } from "@/convex/_generated/dataModel";

export async function createBlogAction(
    values: Pick<z.infer<typeof BlogSchema>, "title" | "body">,
    storageId: Id<"_storage">
) {
    const parsed = BlogSchema.pick({
        title: true,
        body: true,
    }).safeParse(values);

    if (!parsed.success) {
        throw new Error("Invalid form data");
    }

    const token = await getToken();

    await fetchMutation(
        api.posts.createPost,
        {
            title: parsed.data.title,
            body: parsed.data.body,
            storageImageId: storageId,
        },
        { token }
    );
    
    updateTag("blog")
    redirect("/blog");
}
