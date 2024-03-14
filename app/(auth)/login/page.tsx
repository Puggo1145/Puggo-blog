"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardFooter,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Separator from "@/components/separator";
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import useSpinner from "@/components/spinner";
import RegisterCheckDialog from "./_components/register-check-dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { signIn } from "next-auth/react";
import { toast } from 'sonner'

import { useRouter } from "next/navigation";
import { useState } from "react";

const FormSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters long"
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long"
    })
})

const Login: React.FC = () => {

    const router = useRouter();
    const { loading, setLoading, dom: spinnerElement } = useSpinner({ size: "default", className: "mr-2" });
    const [doesUserExists, setDoesUserExists] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        // 检查 User 是否存在
        if (!doesUserExists) {
            setLoading(true);

            const checkUserRes = await fetch("/api/auth/check-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username: data.username })
            })

            if (!checkUserRes.ok) {
                setLoading(false);

                return setDoesUserExists(true);
            }

        }

        const { username, password } = data;

        setLoading(true);
        const res = await signIn("credentials", {
            redirect: false,
            username,
            password
        })

        if (res?.ok) {
            toast.success("Logged in successfully");
            setTimeout(() => router.push("/"), 1000);
        } else {
            toast.error("Invalid username or password");
            form.setError("password", { message: "Invalid username or password" });
            form.setValue("password", "");
        }

        setLoading(false);
    }

    return (
        <div className="h-full flex items-center justify-center">
            <RegisterCheckDialog open={doesUserExists} />

            <Card className="w-[350px] border-none shadow-none">
                <CardHeader>
                    <CardTitle>Log in</CardTitle>
                    <CardDescription>Log in to your account to continue</CardDescription>
                    <CardDescription>If you don not have an account, your registration will be completed automatically</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center gap-y-4">
                        <Form {...form}>
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col w-full space-y-1.5">
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Enter your username..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col w-full space-y-1.5">
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter your password..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button className="w-full" type="submit" disabled={loading}>
                                {spinnerElement}
                                Continue with username
                            </Button>
                        </Form>
                    </form>
                </CardContent>
                <Separator className="px-2">or continue with</Separator>
                <CardFooter className="pt-6">
                    <Button variant="outline" className="w-full" disabled={loading}>
                        {spinnerElement}
                        <GitHubLogoIcon className="mr-2" />
                        Github
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;