"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const description =
  "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account";

export const iframeHeight = "600px";

export const containerClassName =
  "w-full h-screen flex items-center justify-center px-4";

export default function LoginForm() {
  return (
    <main className="bg-secondary-900 h-screen w-full flex items-center">
      <Card className="mx-auto max-w-lg bg-secondary-200  border-0 drop-shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl ">Sign Up</CardTitle>
          <CardDescription className="text-slate-700">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            <Button
              type="submit"
              className="w-full bg-secondary-700 text-white"
            >
              Create an account
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="#" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
