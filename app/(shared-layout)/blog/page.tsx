import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

export const metadata: Metadata = {
    title: "Blog | ShenoMaster",
    description: "Read our latest articles and insights.",
    authors: [{ name: "George Shenoda" }],
};

const BlogPage = () => {
    return (
        <div className="py-12">
            <div className="text-center pb-12">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                    Our BLog
                </h1>
                <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
                    Insights, thoughts and trends from our team!
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Suspense fallback={<SkeletonCard />}>
                    <BlogCard />
                </Suspense>
            </div>
        </div>
    );
};

export default BlogPage;

const BlogCard = async () => {
    "use cache";
    cacheLife("hours");
    cacheTag("blog");
    const data = await fetchQuery(api.posts.getPosts);
    return (
        <>
            {data.length > 0 ? (
                data.map((post) => (
                    <Link href={`/blog/${post._id}`} key={post._id}>
                        <Card className="pt-0 hover:scale-105 transition-transform duration-500">
                            <div className="relative h-48 w-full overflow-hidden">
                                <Image
                                    src={`${
                                        post.imageUrl ??
                                        "https://plus.unsplash.com/premium_photo-1732730224458-4082b9285435?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                    }`}
                                    alt="image"
                                    fill
                                    className="rounded-t-lg object-cover"
                                />
                            </div>
                            <CardContent>
                                <h1 className="text-2xl font-bold hover:text-primary">
                                    {post.title}
                                </h1>
                                <p className="text-muted-foreground line-clamp-3">
                                    {post.body}
                                </p>
                            </CardContent>
                            <CardFooter>
                                <p
                                    className={buttonVariants({
                                        className: "w-full",
                                    })}
                                >
                                    Read more
                                </p>
                            </CardFooter>
                        </Card>
                    </Link>
                ))
            ) : (
                <div className="text-center pb-12 col-span-3">
                    <p className="pt-4 max-w-2xl mx-auto text-2xl text-muted-foreground">
                        No Posts yet Create the First Post
                    </p>
                </div>
            )}
        </>
    );
};

const SkeletonCard = () => {
    return (
        <>
            {[...Array(6)].map((_, i) => {
                return (
                    <div key={i} className="flex flex-col space-y-3">
                        <Skeleton className="h-48 w-full rounded-xl" />
                        <div className="space-y-2 flex-col flex">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                );
            })}
        </>
    );
};
