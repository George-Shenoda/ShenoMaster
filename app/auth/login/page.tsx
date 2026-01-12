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
import { LoginSchema } from "@/app/schemas/auth";
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
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

function Page() {
    const [isLoading, startTransition] = useTransition();
    const form = useForm({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const router = useRouter();

    function onSubmit(data: z.infer<typeof LoginSchema>) {
        startTransition(async () => {
            await authClient.signIn.email({
                email: data.email,
                password: data.password,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Logged in successfully");
                        router.push("/");
                    },
                    onError: (error) => {
                        toast.error(`Login failed: ${error.error.message}`);
                    },
                },
            });
        });
    }

    const [See, setSee] = useState(false);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Login Back to your account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-y-4">
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
                                                <EyeClosed className="absolute right-5 top-[50%] -translate-y-1/2" onClick={() => {setSee(false)}}/>
                                            ) : (
                                                <Eye className="absolute right-5 top-[50%] -translate-y-1/2" onClick={() => {setSee(true)}}/>
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
                                    Login
                                </Button>
                                <Link
                                    href="/auth/sign-up"
                                    className={`flex-1 ${buttonVariants()}`}
                                >
                                    Sign Up
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
