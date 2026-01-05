import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, action } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Processing ${action} request`);

    let systemPrompt = "";
    let functionName = "";
    let functionSchema: any = {};

    switch (action) {
      case "summarize":
        systemPrompt = "You are a study assistant that creates concise, comprehensive summaries of academic content.";
        functionName = "create_summary";
        functionSchema = {
          name: "create_summary",
          description: "Generate a structured summary of academic content",
          parameters: {
            type: "object",
            properties: {
              summary: { type: "string", description: "The main summary" },
              keyPoints: {
                type: "array",
                items: { type: "string" },
                description: "Key points from the content"
              }
            },
            required: ["summary", "keyPoints"]
          }
        };
        break;

      case "flashcards":
        systemPrompt = "You are a study assistant that creates effective flashcards for memorization.";
        functionName = "create_flashcards";
        functionSchema = {
          name: "create_flashcards",
          description: "Generate flashcards for study material",
          parameters: {
            type: "object",
            properties: {
              flashcards: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    question: { type: "string" },
                    answer: { type: "string" }
                  },
                  required: ["question", "answer"]
                },
                description: "Array of flashcard Q&A pairs"
              }
            },
            required: ["flashcards"]
          }
        };
        break;

      case "quiz":
        systemPrompt = "You are a study assistant that creates challenging quiz questions to test understanding.";
        functionName = "create_quiz";
        functionSchema = {
          name: "create_quiz",
          description: "Generate quiz questions with multiple choice answers",
          parameters: {
            type: "object",
            properties: {
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    question: { type: "string" },
                    options: {
                      type: "array",
                      items: { type: "string" }
                    },
                    correctAnswer: { type: "number", description: "Index of correct answer (0-3)" },
                    explanation: { type: "string" }
                  },
                  required: ["question", "options", "correctAnswer", "explanation"]
                }
              }
            },
            required: ["questions"]
          }
        };
        break;

      case "explain":
        systemPrompt = "You are a study assistant that explains complex concepts in simple, easy-to-understand terms.";
        functionName = "explain_concept";
        functionSchema = {
          name: "explain_concept",
          description: "Explain a concept in simple terms",
          parameters: {
            type: "object",
            properties: {
              explanation: { type: "string", description: "Clear, simple explanation" },
              examples: {
                type: "array",
                items: { type: "string" },
                description: "Real-world examples"
              },
              relatedConcepts: {
                type: "array",
                items: { type: "string" },
                description: "Related concepts to explore"
              }
            },
            required: ["explanation", "examples"]
          }
        };
        break;

      default:
        throw new Error("Invalid action");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content }
        ],
        tools: [{ type: "function", function: functionSchema }],
        tool_choice: { type: "function", function: { name: functionName } }
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

    const data = await response.json();
    console.log("AI response received");

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in response");
    }

    const result = JSON.parse(toolCall.function.arguments);
    console.log("Generated result:", result);

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in study-helper function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to process request" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
