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
      }>;
    }
  | { error: string; code: number };

export async function POST(request: Request) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", process.env.apiKey!);
  const body = await request.json();
  const resultArray: ApiResponse[] = [];
  const failed: string[] = [];
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
            limit: 3,
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
          console.log(result);
          if (isSuccessResponse(result)) resultArray.push(result);
          else failed.push(url);
        })
        .catch((error) => {
          console.error(error);
          failed.push(url);
        });
    }
  }

  return Response.json({ resultArray, failed });
}
function isSuccessResponse(
  response: ApiResponse
): response is Exclude<ApiResponse, { error: string; code: number }> {
  return (response as { usage: any }).usage !== undefined;
}
