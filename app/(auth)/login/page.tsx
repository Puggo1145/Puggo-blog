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

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { signIn, useSession } from "next-auth/react";
import { toast } from 'sonner'

const FormSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters long"
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long"
    })
})

const Login: React.FC = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });


    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const { username, password } = data;

        const res = await signIn("credentials", {
            redirect: false,
            username,
            password
        })

        if (res?.ok) {
            toast.success("Logged in successfully");
        }
    }

    return (
        <div className="h-full flex items-center justify-center">
            <Card className="w-[350px] border-none shadow-none">
                <CardHeader>
                    <CardTitle>Log in</CardTitle>
                    <CardDescription>Log in to your account to continue</CardDescription>
                    <CardDescription>If you don't have an account, your registration will be completed automatically</CardDescription>
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
                                            <Input placeholder="Enter your username..." {...field} />
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
                                            <Input placeholder="Enter your password..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button className="w-full" type="submit">Continue with username</Button>
                        </Form>
                    </form>
                </CardContent>
                <Separator className="px-2">or continue with</Separator>
                <CardFooter className="pt-6">
                    <Button variant="outline" className="w-full">
                        <GitHubLogoIcon className="mr-2" />Github
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;