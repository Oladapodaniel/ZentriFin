"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn("credentials", formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid credentials.";
                default:
                    return "Something went wrong.";
            }
        }
        throw error;
    }
}

export async function register(prevState: string | undefined, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return "Invalid fields";
    }

    const { firstName, lastName, email, password } = validatedFields.data;
    const name = `${firstName} ${lastName}`;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return "Email already in use";
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    // Auto-login
    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/projects",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Something went wrong with auto-login.";
                default:
                    return "Something went wrong.";
            }
        }
        throw error; // Rethrow redirect error
    }
}
