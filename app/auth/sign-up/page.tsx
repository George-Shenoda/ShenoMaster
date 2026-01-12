"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/app/schemas/auth";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Eye, EyeClosed, Loader2 } from "lucide-react";

function Page() {
    const [isLoading, startTransition] = useTransition();
    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const router = useRouter();
    const [See, setSee] = useState(false);

    function onSubmit(data: z.infer<typeof signUpSchema>) {
        startTransition(async () => {
            await authClient.signUp.email({
                email: data.email,
                password: data.password,
                name: data.name,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Signed in successfully");
                        router.push("/");
                    },
                    onError: (error) => {
                        toast.error(`Sign up failed: ${error.error.message}`);
                    },
                },
            });
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>
                    Create an account to get started
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-y-4">
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => {
                                return (
                                    <Field>
                                        <FieldLabel>Full Name</FieldLabel>
                                        <Input
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Your full name"
                                            {...field}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        />
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => {
                                return (
                                    <Field>
                                        <FieldLabel>Email</FieldLabel>
                                        <Input
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Your email address"
                                            type="email"
                                            {...field}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        />
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => {
                                return (
                                    <Field>
                                        <FieldLabel>Password</FieldLabel>
                                        <div className="relative">
                                            <Input
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="Your password"
                                                type={See ? "text" : "password"}
                                                {...field}
                                            />
                                            {See ? (
                                                <EyeClosed
                                                    className="absolute right-5 top-[50%] -translate-y-1/2"
                                                    onClick={() => {
                                                        setSee(false);
                                                    }}
                                                />
                                            ) : (
                                                <Eye
                                                    className="absolute right-5 top-[50%] -translate-y-1/2"
                                                    onClick={() => {
                                                        setSee(true);
                                                    }}
                                                />
                                            )}
                                        </div>
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        />
                        {isLoading ? (
                            <Button disabled>
                                <Loader2 className="size-4 animate-spin" />
                                <span>Loading...</span>
                            </Button>
                        ) : (
                            <div className="flex justify-between gap-3">
                                <Button type="submit" className="flex-1">
                                    Sign up
                                </Button>
                                <Link
                                    href="/auth/login"
                                    className={`flex-1 ${buttonVariants()}`}
                                >
                                    Login
                                </Link>
                            </div>
                        )}
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}

export default Page;
