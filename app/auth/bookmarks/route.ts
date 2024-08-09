import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CategoryItem, CategoryType } from "@/app/dashboard/page";
import { revalidateTag } from "next/cache";
export async function GET(request: NextRequest) {
  const supabase = createSupabaseServer();
  // let { data, error } = await supabase.auth.getUser();
  // const id = data.user?.id;
  // console.log(id);
  // if (id) {
  let { data, error } = await supabase
    .schema("public")
    .from("users")
    .select("bookmarks");
  if (error || data === null) {
    return NextResponse.json(null);
  }
  return NextResponse.json(data[0].bookmarks);
}
type ApiResponse =
  | {
      usage: {
        text_units: number;
        text_characters: number;
        features: number;
      };
      retrieved_url: string;
      language: string;
      categories: Array<{
        score: number;
        label: string;
        explanation?: {
          relevant_text: string[];
        };
      }>;
    }
  | { error: string; code: number };

export async function POST(request: Request) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", process.env.apiKey!);
  const body = await request.json();
  const resultArray: Array<ApiResponse | null> = [];
  const dict: {
    [label: string]: CategoryItem;
  } = {};
  const supabase = createSupabaseServer();
  let { data, error } = await supabase.auth.getUser();
  if (error) {
    redirect("/");
  }
  if (body && !body.purge) {
    const itemArray = body as CategoryItem;
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: "",
      // redirect: "follow",
    };
    for (const item of itemArray) {
      const raw = JSON.stringify({
        url: item.url,
        features: {
          categories: {
            limit: 1,
            model: process.env.model,
            // explanation: true,
            limit_text_characters: 9000,
          },
        },
      });
      requestOptions.body = raw;
      await fetch(
        `${process.env.URL}/v1/analyze?version=2022-04-07`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result: ApiResponse) => {
          if (isSuccessResponse(result)) resultArray.push(result);
          else resultArray.push(null);
        })
        .catch((error) => {
          console.error(error);
          resultArray.push(null);
        });
    }

    dict["/Unavailable"] = [];
    for (let i = 0; i < itemArray.length; i++) {
      const res = resultArray[i];
      if (res !== null && isSuccessResponse(res)) {
        if (dict[res.categories[0].label])
          dict[res.categories[0].label].push(itemArray[i]);
        else {
          dict[res.categories[0].label] = [itemArray[i]];
        }
      } else {
        dict["/Unavailable"].push(itemArray[i]);
      }
    }
    const res = await supabase.rpc("add_bookmark_to_user", {
      user_id: data.user?.id,
      new_bookmark: dict,
    });

    if (res.error) {
      return Response.json({ error });
    }
    revalidateTag("bookmarks");
  } else if (body && body.purge) {
    let res = await supabase
      .from("users")
      .update({ bookmarks: {} })
      .eq("id", data.user?.id);
    if (res.status !== 200 && res.status !== 204) {
      return Response.json(false);
    } else {
      revalidateTag("bookmarks");
      return Response.json(true);
    }
  }

  return Response.json(dict);
}
function isSuccessResponse(
  response: ApiResponse
): response is Exclude<ApiResponse, { error: string; code: number }> {
  return (response as { usage: any }).usage !== undefined;
}
