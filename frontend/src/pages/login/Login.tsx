"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import DummyCredentials from "@/components/AppSidebar/Dummycredentials";

import useLogin from "@/hooks/useLogin";

const formSchema = z.object({
  rollNumber: z.string().min(3, "Roll Number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginForm() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { rollNumber: "", password: "" },
  });

  const { login, loading } = useLogin();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    login(values);
  };

  const inputClasses =
    "w-full px-3 pt-5 pb-2 rounded-lg bg-black/50 text-gray-100 border border-gray-700 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200";

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="w-full max-w-sm p-6 rounded-2xl bg-black/60 backdrop-blur-lg border border-gray-800 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-gray-100 font-bold">Welcome Back!</CardTitle>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="flex flex-col gap-6">
              {/* Roll Number */}
              <FormField
                control={form.control}
                name="rollNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        id="rollNumber"
                        type="text"
                        placeholder="Roll Number"
                        aria-label="Roll Number"
                        autoComplete="username"
                        className={inputClasses}
                        required
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-sm mt-1" />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        id="password"
                        type="password"
                        placeholder="Password"
                        aria-label="Password"
                        autoComplete="current-password"
                        className={inputClasses}
                        required
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-sm mt-1" />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              {/* Full-width login button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all duration-200 hover:scale-105"
              >
                {loading ? "Logging In..." : "Log In"}
              </Button>

              {/* Small text for signup */}
              <p className="text-center text-gray-400 text-sm">
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-indigo-400 hover:text-indigo-500 font-medium"
                >
                  Create one
                </button>
              </p>
            </CardFooter>

          </form>
        </Form>
      </Card>
      <DummyCredentials/>
    </div>
  );
}
