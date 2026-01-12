"use client";

import { createBlogAction } from "@/app/actions";
import { BlogSchema } from "@/app/schemas/blog";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const Create = () => {
    const [isLoading, startTransition] = useTransition();
    const form = useForm({
        resolver: zodResolver(BlogSchema),
        defaultValues: {
            title: "",
            body: "",
            Image: undefined,
        },
    });
    const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
    async function onSubmit(values: z.infer<typeof BlogSchema>) {
        startTransition(async () => {
            const uploadUrl = await generateUploadUrl();

            const res = await fetch(uploadUrl, {
                method: "POST",
                headers: {
                    "Content-Type": values.Image.type,
                },
                body: values.Image, // File goes DIRECTLY to storage
            });

            if (!res.ok) throw new Error("Upload failed");

            const { storageId } = await res.json();

            await createBlogAction(
                {
                    title: values.title,
                    body: values.body,
                },
                storageId
            );

            form.reset();
        });
    }

    return (
        <div className="py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                    Create Post
                </h1>
                <p className="text-xl text-muted-foreground pt-4">
                    Share your thoughts with the world
                </p>
            </div>
            <Card className="max-w-xl w-full mx-auto">
                <CardHeader>
                    <CardTitle>Create Blog Article</CardTitle>
                    <CardDescription>Create a new blog article</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup className="gap-y-4">
                            <Controller
                                name="title"
                                control={form.control}
                                render={({ field, fieldState }) => {
                                    return (
                                        <Field>
                                            <FieldLabel>Title</FieldLabel>
                                            <Input
                                                {...field}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="Enter the title"
                                            />
                                            {fieldState.error && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    );
                                }}
                            />
                            <Controller
                                name="body"
                                control={form.control}
                                render={({ field, fieldState }) => {
                                    return (
                                        <Field>
                                            <FieldLabel>Content</FieldLabel>
                                            <Textarea
                                                {...field}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="Enter the content"
                                            />
                                            {fieldState.error && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    );
                                }}
                            />
                            <Controller
                                name="Image"
                                control={form.control}
                                render={({ field, fieldState }) => {
                                    return (
                                        <Field>
                                            <FieldLabel>Image</FieldLabel>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const files =
                                                        e.target.files;
                                                    if (
                                                        files &&
                                                        files.length > 0
                                                    ) {
                                                        field.onChange(
                                                            files[0]
                                                        );
                                                    }
                                                }}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                            />
                                            {fieldState.error && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    );
                                }}
                            />
                            <Button disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />{" "}
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    "Create Post"
                                )}
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Create;
