import { createSupabaseServer } from "@/lib/supabase/server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", process.env.apiKey!);
  const body = await request.json();

  const supabase = createSupabaseServer();
  let { data, error } = await supabase.auth.getUser();
  if (error) {
    return redirect("/");
  }
  let res = await supabase
    .from("users")
    .update({ bookmarks: body })
    .eq("id", data.user?.id);
  console.log(res);
  revalidateTag("bookmarks");

  if (res.status !== 200 && res.status !== 204) {
    return Response.json(false);
  } else {
    return Response.json(true);
  }
}
