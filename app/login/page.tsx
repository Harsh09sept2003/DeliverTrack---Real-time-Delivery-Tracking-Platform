"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const role = searchParams.get("role") || "customer";
  const roleTitle = role.charAt(0).toUpperCase() + role.slice(1);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    
    try {
      // In a real app, you would make an API call here
      console.log("Login data:", { ...data, role });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Login successful!",
        description: `Welcome back to the ${roleTitle} dashboard.`,
      });
      
      // Redirect based on role
      router.push(`/${role}/dashboard`);
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <Link href="/" className="absolute top-4 left-4 flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to home</span>
      </Link>
      
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-2">
          <MapPin className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">DeliverTrack</h1>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{roleTitle} Login</CardTitle>
          <CardDescription>
            Sign in to access your {role} dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </div>
          <div className="text-xs text-center text-muted-foreground">
            <Link href="/login?role=vendor" className={`mx-2 ${role === "vendor" ? "text-primary font-medium" : "hover:underline"}`}>
              Vendor
            </Link>
            <Link href="/login?role=partner" className={`mx-2 ${role === "partner" ? "text-primary font-medium" : "hover:underline"}`}>
              Delivery Partner
            </Link>
            <Link href="/login?role=customer" className={`mx-2 ${role === "customer" ? "text-primary font-medium" : "hover:underline"}`}>
              Customer
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}