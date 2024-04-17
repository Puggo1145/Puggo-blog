"use client"

// UI
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
import { GitHubLogoIcon } from '@radix-ui/react-icons'
// components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Separator from "@/components/separator";
import useSpinner from "@/components/spinner";
// zod
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// utils
import { toast } from 'sonner'
// hooks
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
// schema
import { LoginSchema } from "@/constants/zodSchema/auth";


const Login: React.FC = () => {

    const router = useRouter();
    const { data: session } = useSession();
    const { loading, setLoading, Spinner } = useSpinner();

    // redirect if user is already logged in
    useEffect(() => {
        if (session?.user.id) {
            router.replace("/");
        }
    }, [session]);
    

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    });

    async function onSubmit(data: z.infer<typeof LoginSchema>) {
        const { username, password } = data;

        setLoading(true);
        const res = await signIn("credentials", {
            redirect: false,
            username,
            password
        })

        if (res?.ok) {
            toast.success("Logged in successfully");
            router.replace("/");
        } else {
            toast.error("Invalid username or password");
            form.setError("password", { message: "Invalid username or password" });
            form.setValue("password", "");
        }

        setLoading(false);
    }

    return (
        <div className="h-full flex items-center justify-center">
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
                                <Spinner size="default" className="mr-2" />
                                Continue with username
                            </Button>
                        </Form>
                    </form>
                </CardContent>
                <Separator className="px-2">or continue with</Separator>
                <CardFooter className="pt-6">
                    <Button variant="outline" className="w-full" disabled={loading}>
                        <Spinner size="default" className="mr-2" />
                        <GitHubLogoIcon className="mr-2" />
                        Github
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;