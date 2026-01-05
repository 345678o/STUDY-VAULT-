// @ts-expect-error - Deno import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Declare Deno global for TypeScript
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

// Declare types for Deno/Supabase Edge Functions
interface ResponseInit {
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
}

interface RequestInit {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

interface Request {
  method: string;
  json(): Promise<{ concept: string }>;
}

interface Response {
  ok: boolean;
  status: number;
  text(): Promise<string>;
  json(): Promise<unknown>;
}

interface AIResponse {
  choices?: Array<{
    message?: {
      tool_calls?: Array<{
        function?: {
          arguments: string;
        };
      }>;
    };
  }>;
}

// Declare globals
declare const Response: {
  new(body?: string | null, init?: ResponseInit): Response;
};
declare const console: {
  log(...args: unknown[]): void;
  error(...args: unknown[]): void;
};
declare const fetch: (input: string, init?: RequestInit) => Promise<Response>;
declare const Request: {
  new(input: string, init?: RequestInit): Request;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { concept } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating mind map for concept:", concept);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a mind map generator. Create hierarchical mind maps with a central concept and related branches. Return only valid JSON.",
          },
          {
            role: "user",
            content: `Create a detailed mind map for the concept: "${concept}". Return a JSON object with this structure:
{
  "central": "main concept",
  "branches": [
    {
      "title": "branch name",
      "subbranches": ["item1", "item2", "item3"]
    }
  ]
}
Include 4-6 main branches, each with 3-5 subbranches. Make it educational and comprehensive.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_mindmap",
              description: "Generate a structured mind map",
              parameters: {
                type: "object",
                properties: {
                  central: { type: "string" },
                  branches: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        subbranches: {
                          type: "array",
                          items: { type: "string" }
                        }
                      },
                      required: ["title", "subbranches"]
                    }
                  }
                },
                required: ["central", "branches"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "create_mindmap" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json() as AIResponse;
    console.log("AI response:", JSON.stringify(data));

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || !toolCall.function) {
      throw new Error("No tool call in response");
    }

    const mindmapData = JSON.parse(toolCall.function.arguments);
    console.log("Generated mindmap:", mindmapData);

    return new Response(JSON.stringify({ mindmap: mindmapData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-mindmap function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to generate mind map" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
