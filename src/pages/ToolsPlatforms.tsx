import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, HelpCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const ToolsPlatforms = () => {
  const { toast } = useToast();
  
  const tools = [
    {
      icon: <Brain className="h-12 w-12" />,
      title: "Quiz / Practice Tests",
      description: "Test your knowledge with comprehensive quizzes and mock exams",
      features: ["Adaptive difficulty", "Detailed explanations", "Performance analytics", "Timed assessments"],
      color: "bg-primary/10 text-primary"
    },
    {
      icon: <HelpCircle className="h-12 w-12" />,
      title: "Doubt Clearing Section",
      description: "Get your academic doubts resolved by experts and peers",
      features: ["Expert tutors available", "Quick response time", "Visual explanations", "Follow-up support"],
      color: "bg-accent/10 text-accent"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Tools & Platforms
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto font-medium">
            Powerful digital tools designed to enhance your learning experience and boost productivity
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {tools.map((tool, index) => (
            <Card key={index} className="card-shadow hover:shadow-lg transition-smooth h-full">
              <CardHeader className="pb-4">
                <div className={`w-20 h-20 rounded-xl ${tool.color} flex items-center justify-center mb-4`}>
                  {tool.icon}
                </div>
                <CardTitle className="text-xl font-bold text-foreground leading-tight">
                  {tool.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col">
                <p className="text-foreground/80 mb-4 font-medium">
                  {tool.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {tool.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-foreground font-medium">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="primary" 
                  className="w-full mt-auto"
                  onClick={() => toast({
                    title: "Coming Soon!",
                    description: `${tool.title} will be available shortly.`,
                  })}
                >
                  Access Tool
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Platform Integration */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Integrated Learning Experience
            </h2>
            <p className="text-foreground/70 mb-6 font-medium">
              All our tools work seamlessly together to create a unified learning environment. 
              Track your progress across different activities, sync your schedules, and collaborate 
              effortlessly with peers and mentors.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                variant="primary"
                onClick={() => toast({
                  title: "Integration Guide",
                  description: "Detailed integration documentation coming soon!",
                })}
              >
                Explore Integration
              </Button>
              <Button 
                variant="outline"
                onClick={() => toast({
                  title: "Demo Video",
                  description: "Product demo video will be available soon!",
                })}
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsPlatforms;