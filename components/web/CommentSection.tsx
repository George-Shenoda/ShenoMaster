"use client";

import { Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Id } from "@/convex/_generated/dataModel";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentSchema } from "@/app/schemas/comment";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import z from "zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

function CommentSection(props : {preloadComments: Preloaded<typeof api.comments.getCommentsByPostId>}) {
    const { id } = useParams<{ id: Id<"posts"> }>();
    const [isLoading, startTransition] = useTransition();
    const mutation = useMutation(api.comments.postComment);
    const comments = usePreloadedQuery(props.preloadComments)
    const form = useForm({
        resolver: zodResolver(CommentSchema),
        defaultValues: {
            postId: id,
            body: "",
        },
    });
    if (comments === undefined) {
        return <p>Loading...</p>;
    }
    function onSubmit(values: z.infer<typeof CommentSchema>) {
        startTransition(async () => {
            try {
                await mutation({
                    postId: id,
                    body: values.body,
                });
                form.reset();
                toast.success("Comment Sent");
            } catch (e) {
                toast.error(`Failed to send comment: ${e}`);
            }
        });
    }
    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-2 border-b">
                <MessageSquare className="size-5" />
                <h2 className="text-xl font-bold">
                    {comments?.length ?? "0"} Comments
                </h2>
            </CardHeader>
            <CardContent>
                <form
                    className="space-y-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <Controller
                        name="body"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Comment</FieldLabel>
                                <Textarea
                                    aria-invalid={fieldState.invalid}
                                    {...field}
                                    placeholder="Write your comment"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Button disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />{" "}
                                <span>Creating...</span>
                            </>
                        ) : (
                            "Create Comment"
                        )}
                    </Button>
                </form>
                {comments.length > 0 && <Separator className="my-6" />}
                <section className="space-y-8">
                    {comments.map((comment) => (
                        <div key={comment._id} className="flex gap-4">
                            <Avatar className="size-10 shrink-0">
                                <AvatarImage
                                    src={`https://avatar.vercel.sh/rauchg?rounded=60?text=${comment.authorName}`}
                                    alt={comment.authorName}
                                />
                                <AvatarFallback>
                                    {comment.authorName
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-sm">
                                        {comment.authorName}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {new Date(
                                            comment._creationTime
                                        ).toLocaleDateString("en-UK")}
                                    </p>
                                </div>
                                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                                    {comment.body}
                                </p>
                            </div>
                        </div>
                    ))}
                </section>
            </CardContent>
        </Card>
    );
}

export default CommentSection;
