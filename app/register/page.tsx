"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import SignUp from "../../components/supaauth/signup";
import Social from "@/components/supaauth/social";
export const description =
  "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account";

export const iframeHeight = "600px";

export const containerClassName =
  "w-full h-screen flex items-center justify-center px-4";

export default function LoginForm() {
  const queryString =
    typeof window !== "undefined" ? window?.location.search : "";
  const urlParams = new URLSearchParams(queryString);
  const next = urlParams.get("next");
  const verify = urlParams.get("verify");
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
          <SignUp redirectTo={next || "/dashboard"} />
          <Social redirectTo={next || "/dashboard"} />
        </CardContent>
      </Card>
    </main>
  );
}
