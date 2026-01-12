import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CommentSection from "@/components/web/CommentSection";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Presence from "@/components/web/Presence";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { Preloaded } from "convex/react";
import { FunctionReference } from "convex/server";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";

interface BlogPageProps {
    params: Promise<{ id: Id<"posts"> }>;
}

export async function generateMetadata({
    params,
}: BlogPageProps): Promise<Metadata> {
    const { id } = await params;
    const post = await fetchQuery(api.posts.getPost, { postId: id });
    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    return {
        title: post.title,
        description: post.body,
    };
}
interface BlogProp {
    post: {
        imageUrl: string | null;
        _id: Id<"posts">;
        _creationTime: number;
        storageImageId?: Id<"_storage"> | undefined;
        title: string;
        body: string;
        authorId: string;
    };
    preloadedComments: Preloaded<
        FunctionReference<
            "query",
            "public",
            {
                postId: Id<"posts">;
            },
            {
                _id: Id<"comments">;
                _creationTime: number;
                body: string;
                authorId: string;
                postId: Id<"posts">;
                authorName: string;
            }[],
            string | undefined
        >
    >;
}
async function BlogPage({ params }: BlogPageProps) {
    const { id } = await params;
    let post;
    const preloadComments = await preloadQuery(
        api.comments.getCommentsByPostId,
        {
            postId: id,
        }
    );
    try {
        post = await fetchQuery(api.posts.getPost, { postId: id });
    } catch {
        notFound();
    }
    if (!post) {
        notFound();
    }
    return (
        <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
            <Link
                href="/blog"
                className={buttonVariants({
                    variant: "outline",
                    className: "mb-4",
                })}
            >
                <ArrowLeft className="size-4" />
                Back to Blog
            </Link>
            <Blog post={post} preloadedComments={preloadComments} />
        </div>
    );
}

const Blog = async ({ post, preloadedComments }: BlogProp) => {
    const userId = await fetchQuery(
        api.presence.getUser,
        {},
        { token: await getToken() }
    );
    if (!userId) {
        redirect(`/auth/login`);
    }
    return (
        <>
            <div className="relative w-full h-100 mb-8 rounded-xl overflow-hidden shadow-sm">
                <Image
                    src={`${
                        post.imageUrl ??
                        "https://plus.unsplash.com/premium_photo-1732730224458-4082b9285435?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }`}
                    alt={post.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                />
            </div>
            <div className="space-y-4 flex flex-col">
                <h1 className="text-4xl tracking-tight font-bold text-foreground">
                    {post.title}
                </h1>
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                        Posted on:{" "}
                        {new Date(post._creationTime).toLocaleDateString(
                            "en-UK"
                        )}
                    </p>
                    {userId && <Presence roomId={post._id} userId={userId} />}
                </div>
                <Separator className="my-8" />
                <p className="text-lg leading-relaxed text-foreground/90">
                    {post.body}
                </p>
                <Separator className="my-8" />

                <CommentSection preloadComments={preloadedComments} />
            </div>
        </>
    );
};

export default BlogPage;
