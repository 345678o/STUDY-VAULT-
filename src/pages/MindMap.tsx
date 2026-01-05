import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Brain, Loader2 } from "lucide-react";

interface MindMapData {
  central: string;
  branches: {
    title: string;
    subbranches: string[];
  }[];
}

const MindMap = () => {
  const [concept, setConcept] = useState("");
  const [mindmap, setMindmap] = useState<MindMapData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateMindMap = async () => {
    if (!concept.trim()) {
      toast({
        title: "Error",
        description: "Please enter a concept",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-mindmap", {
        body: { concept },
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setMindmap(data.mindmap);
      toast({
        title: "Success!",
        description: "Mind map generated successfully",
      });
    } catch (error) {
      console.error("Error generating mind map:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate mind map",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Mind Map Generator
            </h1>
          </div>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto font-medium">
            Enter any concept and AI will create a comprehensive mind map to help you understand it better
          </p>
        </div>

        <Card className="max-w-2xl mx-auto mb-8">
          <CardHeader>
            <CardTitle>Enter Your Concept</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="e.g., Photosynthesis, Machine Learning, World War II..."
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && generateMindMap()}
                className="flex-1"
              />
              <Button
                onClick={generateMindMap}
                disabled={isLoading}
                variant="primary"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {mindmap && (
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col items-center">
                  {/* Central Node */}
                  <div className="bg-gradient-to-r from-primary to-accent text-white rounded-2xl px-8 py-6 mb-12 shadow-lg">
                    <h2 className="text-2xl font-bold text-center">{mindmap.central}</h2>
                  </div>

                  {/* Branches Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    {mindmap.branches.map((branch, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        {/* Branch Title */}
                        <div className="bg-primary/20 text-foreground rounded-xl px-6 py-4 mb-4 shadow-md border-2 border-primary/30 w-full">
                          <h3 className="text-lg font-bold text-center">{branch.title}</h3>
                        </div>

                        {/* Subbranches */}
                        <div className="space-y-2 w-full pl-4">
                          {branch.subbranches.map((sub, subIdx) => (
                            <div
                              key={subIdx}
                              className="bg-card border border-border rounded-lg px-4 py-2 text-sm font-medium text-foreground/80 hover:bg-accent/10 transition-smooth"
                            >
                              • {sub}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MindMap;
