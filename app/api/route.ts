export type ApiResponse =
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
  if (body) {
    const urlArray = body as Array<string>;
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: "",
      // redirect: "follow",
    };
    for (const url of urlArray) {
      console.log(url);
      const raw = JSON.stringify({
        url: url,
        features: {
          categories: {
            limit: 1,
            model: process.env.model,
            explanation: true,
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
  }

  return Response.json({ resultArray });
}
export function isSuccessResponse(
  response: ApiResponse
): response is Exclude<ApiResponse, { error: string; code: number }> {
  return (response as { usage: any }).usage !== undefined;
}
