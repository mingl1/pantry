import { SignInForm } from "@/components/supaauth/signin";
import Social from "@/components/supaauth/social";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export default function SignInPage() {
  const queryString =
    typeof window !== "undefined" ? window?.location.search : "";
  const urlParams = new URLSearchParams(queryString);

  // Get the value of the 'next' parameter
  const next = urlParams.get("next");
  return (
    <main className="bg-secondary-900 h-screen w-full flex items-center">
      <Card className="mx-auto max-w-lg bg-secondary-200  border-0 drop-shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl ">Log in</CardTitle>
          <CardDescription className="text-slate-700">
            Welcome back! Please sign in to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Social redirectTo={next || "/dashboard"} />
          <SignInForm redirectTo={next || "/dashboard"} />
        </CardContent>
      </Card>
    </main>
  );
}
