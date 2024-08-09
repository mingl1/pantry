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

export function isSuccessResponse(
  response: ApiResponse
): response is Exclude<ApiResponse, { error: string; code: number }> {
  return (response as { usage: any }).usage !== undefined;
}
