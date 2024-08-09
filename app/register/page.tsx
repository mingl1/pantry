import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

import SignUp from "../../components/supaauth/signup";
import Social from "@/components/supaauth/social";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";

export default function LoginForm() {
  const queryString =
    typeof window !== "undefined" ? window?.location.search : "";
  const urlParams = new URLSearchParams(queryString);
  const next = urlParams.get("next");
  const verify = urlParams.get("verify");
  return (
    <main className="bg-background h-screen w-full flex items-center">
      <div className="container relative hidden h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href={"/signin"}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-12 top-4 md:right-16 md:top-4 "
          )}
        >
          Login
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-black dark:text-white dark:border-r lg:flex">
          <div className="absolute inset-0 dark:bg-primary-900 bg-secondary-300" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Bookmark className="-mr-0.5" /> PageMark Co
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This website has caused me countless hours of work. Find
                your bookmarks faster than ever before. Free of Charge.&rdquo;
              </p>
              <footer className="text-sm">
                Mark{" "}
                <a
                  className="text-muted-foreground font-light cursor-pointer"
                  href="https://x.com/PageMarkCo"
                  target="_blank"
                >
                  @PageMarkCo
                </a>
              </footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight dark:text-slate-300">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to create your account
              </p>
            </div>
            <SignUp redirectTo={next || "/dashboard"} />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Social redirectTo={next || "/dashboard"} />

            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
