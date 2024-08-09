"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io5";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { Icons } from "../ui/icons";

export default function Social({ redirectTo }: { redirectTo: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loginWithProvider = async (provider: "github" | "google") => {
    const supbase = createSupabaseBrowser();
    console.log(window.location.origin);
    console.log("redirectTO:" + redirectTo);
    await supbase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo:
          window.location.origin + `/auth/callback?next=` + redirectTo,
      },
    });
  };

  return (
    <Button
      variant="outline"
      type="button"
      disabled={isLoading}
      onClick={() => {
        setIsLoading(true);
        loginWithProvider("google");
      }}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.google className="mr-2 h-4 w-4" />
      )}{" "}
      Google
    </Button>
  );
}
