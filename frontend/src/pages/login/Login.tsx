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

  return (
    <div className=" px-2 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md p-8 rounded-3xl bg-black/70 backdrop-blur-xl border border-gray-700/50 shadow-2xl relative z-10 transform hover:scale-[1.02] transition-all duration-300">
        <CardHeader className="text-center space-y-4">

          <CardTitle className="text-3xl  font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Welcome Back!
          </CardTitle>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="flex flex-col gap-6 px-0">
              {/* Roll Number */}
              <FormField
                control={form.control}
                name="rollNumber"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormControl>
                      <Input
                        {...field}
                        id="rollNumber"
                        type="text"
                        placeholder="Roll Number"
                        aria-label="Roll Number"
                        autoComplete="username"
                        className="w-full px-4 py-3 rounded-xl bg-gray-900/50 text-gray-100 border border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-500"
                        required
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs mt-1" />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormControl>
                      <Input
                        {...field}
                        id="password"
                        type="password"
                        placeholder="Password"
                        aria-label="Password"
                        autoComplete="current-password"
                        className="w-full px-4 py-3 rounded-xl bg-gray-900/50 text-gray-100 border border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-500"
                        required
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs mt-1" />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex flex-col gap-4 px-0">
              {/* Full-width login button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Logging In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Small text for signup */}
              <p className="text-center text-gray-400 text-sm mt-2">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-2 transition-colors duration-200"
                >
                  Create one
                </button>
              </p>
            </CardFooter>

          </form>
        </Form>
      </Card>
      <DummyCredentials />
    </div>
  );
}
