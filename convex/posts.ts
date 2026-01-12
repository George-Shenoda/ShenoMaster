import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./auth";
import { Doc, Id } from "./_generated/dataModel";

// Create a new post with the given title and body
export const createPost = mutation({
    args: {
        title: v.string(),
        body: v.string(),
        storageImageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
        const user = await authComponent.safeGetAuthUser(ctx);
        if (!user) {
            throw new ConvexError("Not authenticated");
        }
        const newPostId = await ctx.db.insert("posts", {
            title: args.title,
            body: args.body,
            authorId: user._id,
            storageImageId: args.storageImageId,
        });
        return newPostId;
    },
});

export const getPosts = query({
    handler: async (ctx) => {
        const posts = await ctx.db.query("posts").order("desc").collect();
        return await Promise.all(
            posts.map(async (post) => {
                const imageUrl =
                    post.storageImageId !== undefined
                        ? await ctx.storage.getUrl(post.storageImageId)
                        : null;
                return {
                    ...post,
                    imageUrl,
                };
            })
        );
    },
});

export const getPost = query({
    args: {
        postId: v.id("posts"),
    },
    handler: async (ctx, args) => {
        const post = await ctx.db.get(args.postId);
        if (!post) {
            return null;
        }
        const imageUrl =
            post.storageImageId !== undefined
                ? await ctx.storage.getUrl(post.storageImageId)
                : null;
        return {
            ...post,
            imageUrl,
        };
    },
});

export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        const user = await authComponent.safeGetAuthUser(ctx);
        if (!user) {
            throw new ConvexError("Not authenticated");
        }
        return await ctx.storage.generateUploadUrl();
    },
});

interface searchResTypes {
    _id: Id<"posts">;
    title: string;
    body: string;
}

export const searchPosts = query({
    args: {
        search: v.string(),
        limit: v.number(),
    },
    handler: async (ctx, args) => {
        const user = await authComponent.safeGetAuthUser(ctx);
        if (!user) {
            throw new ConvexError("Not authenticated");
        }

        const res = Array<searchResTypes>();
        const seen = new Set();
        const pushPosts = async (docs: Array<Doc<"posts">>) => {
            for (const doc of docs) {
                if (seen.has(doc._id)) continue;
                seen.add(doc._id);

                res.push({
                    _id: doc._id,
                    title: doc.title,
                    body: doc.body,
                });

                if (res.length >= args.limit) break;
            }
        };

        const titleMatches = await ctx.db
            .query("posts")
            .withSearchIndex("search_title", (q) =>
                q.search("title", args.search)
            )
            .take(args.limit);

        await pushPosts(titleMatches);

        if (res.length >= args.limit) return res;

        const bodyMatches = await ctx.db
            .query("posts")
            .withSearchIndex("search_body", (q) =>
                q.search("body", args.search)
            )
            .take(args.limit);

        await pushPosts(bodyMatches);

        return res;
    },
});
