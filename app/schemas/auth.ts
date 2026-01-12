import { z } from "zod";

export const signUpSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters long")
        .max(30, "Name must be at most 30 characters long"),
    email: z.email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .max(32, "Password must be at most 32 characters long")
        .regex(
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/,
            "Password must contain at least one letter and one number"
        ),
});

export const LoginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().max(32, "Password must be at most 32 characters long"),
});
