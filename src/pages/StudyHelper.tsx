import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Brain, Loader2, BookOpen, HelpCircle, FileQuestion, Lightbulb } from "lucide-react";

interface FlashCard {
  question: string;
  answer: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Summary {
  summary: string;
  keyPoints: string[];
}

interface Explanation {
  explanation: string;
  examples: string[];
  relatedConcepts?: string[];
}

type Result =
  | Summary
  | { flashcards: FlashCard[] }
  | { questions: QuizQuestion[] }
  | Explanation
  | null;

const StudyHelper = () => {
  const [content, setContent] = useState("");
  const [action, setAction] = useState("summarize");
  const [result, setResult] = useState<Result>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const processContent = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content to process",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("study-helper", {
        body: { content, action },
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setResult(data.result);
      toast({
        title: "Success!",
        description: "Content processed successfully",
      });
    } catch (error) {
      console.error("Error processing content:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process content",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    switch (action) {
      case "summarize": {
        const summary = result as Summary;
        return (
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90 mb-4">{summary.summary}</p>
              <h4 className="font-semibold mb-2">Key Points:</h4>
              <ul className="space-y-2">
                {summary.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );

      }

      case "flashcards": {
        const flashcards = (result as { flashcards: FlashCard[] }).flashcards;
        return (
          <div className="space-y-4">
            {flashcards.map((card, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">Flashcard {idx + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="font-semibold text-primary mb-2">Question:</p>
                    <p className="text-foreground/90">{card.question}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-accent mb-2">Answer:</p>
                    <p className="text-foreground/90">{card.answer}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      }

      case "quiz": {
        const questions = (result as { questions: QuizQuestion[] }).questions;
        return (
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">Question {idx + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold mb-4">{q.question}</p>
                  <div className="space-y-2 mb-4">
                    {q.options.map((option, optIdx) => (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-lg border ${
                          optIdx === q.correctAnswer
                            ? "bg-primary/10 border-primary"
                            : "bg-card border-border"
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <p className="font-semibold text-accent mb-1">Explanation:</p>
                    <p className="text-sm text-foreground/90">{q.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      }

      case "explain": {
        const explanation = result as Explanation;
        return (
          <Card>
            <CardHeader>
              <CardTitle>Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90 mb-6">{explanation.explanation}</p>
              
              <h4 className="font-semibold mb-3">Examples:</h4>
              <ul className="space-y-2 mb-6">
                {explanation.examples.map((example, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-accent mr-2">→</span>
                    <span className="text-foreground/90">{example}</span>
                  </li>
                ))}
              </ul>

              {explanation.relatedConcepts && explanation.relatedConcepts.length > 0 && (
                <>
                  <h4 className="font-semibold mb-3">Related Concepts:</h4>
                  <div className="flex flex-wrap gap-2">
                    {explanation.relatedConcepts.map((concept, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );

      }

      default:
        return null;
    }
  };

  const actionIcons = {
    summarize: <BookOpen className="h-5 w-5" />,
    flashcards: <FileQuestion className="h-5 w-5" />,
    quiz: <HelpCircle className="h-5 w-5" />,
    explain: <Lightbulb className="h-5 w-5" />,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              AI Study Helper
            </h1>
          </div>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto font-medium">
            Transform your study materials with AI-powered summaries, flashcards, quizzes, and explanations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Your Content</CardTitle>
              <CardDescription>
                Paste your study material, notes, or concepts you want to process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Action</label>
                <Select value={action} onValueChange={setAction}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      {actionIcons[action as keyof typeof actionIcons]}
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summarize">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Summarize
                      </div>
                    </SelectItem>
                    <SelectItem value="flashcards">
                      <div className="flex items-center gap-2">
                        <FileQuestion className="h-4 w-4" />
                        Create Flashcards
                      </div>
                    </SelectItem>
                    <SelectItem value="quiz">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" />
                        Generate Quiz
                      </div>
                    </SelectItem>
                    <SelectItem value="explain">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Explain Concept
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <Textarea
                  placeholder="Enter your study material, notes, or concept here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  className="resize-none"
                />
              </div>

              <Button
                onClick={processContent}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-5 w-5" />
                    Process Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div>
            {result ? (
              renderResult()
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Results Yet</h3>
                  <p className="text-muted-foreground">
                    Enter your content and click "Process Content" to see AI-generated results
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyHelper;
