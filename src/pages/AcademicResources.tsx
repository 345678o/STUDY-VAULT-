import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, BookOpen, PenTool, Upload } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AcademicResources = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const resources = [
    {
      icon: <FileText className="h-12 w-12" />,
      title: "Previous Year Questions",
      description: "Comprehensive collection of exam papers from previous years across all subjects and programs",
      features: ["Subject-wise categorization", "Detailed solutions", "Difficulty level indicators", "Exam pattern analysis"],
      color: "bg-primary/10 text-primary"
    },
    {
      icon: <BookOpen className="h-12 w-12" />,
      title: "Lecture Notes & Summaries",
      description: "Well-structured notes and summaries covering complete syllabus for effective revision",
      features: ["Topic-wise organization", "Key concept highlights", "Formula sheets", "Quick revision guides"],
      color: "bg-accent/10 text-accent"
    },
    {
      icon: <Video className="h-12 w-12" />,
      title: "Recorded Video Classes",
      description: "High-quality video lectures by experienced faculty members for enhanced understanding",
      features: ["HD video quality", "Downloadable content", "Subtitles available", "Playback speed control"],
      color: "bg-secondary/10 text-secondary"
    },
    {
      icon: <PenTool className="h-12 w-12" />,
      title: "Sample Assignments & Projects",
      description: "Reference assignments and project templates to guide your academic work",
      features: ["Format guidelines", "Evaluation criteria", "Best practices", "Submission templates"],
      color: "bg-primary/10 text-primary"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Academic Resources
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto font-medium mb-6">
            Access comprehensive study materials designed to help you excel in your academic pursuits
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/resources")}
            className="gap-2"
          >
            <Upload className="h-5 w-5" />
            Manage My Study Materials
          </Button>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {resources.map((resource, index) => (
            <Card key={index} className="card-shadow hover:shadow-lg transition-smooth">
              <CardHeader className="pb-4">
                <div className={`w-20 h-20 rounded-xl ${resource.color} flex items-center justify-center mb-4`}>
                  {resource.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  {resource.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 mb-6 font-medium">
                  {resource.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {resource.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-foreground font-medium">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => toast({
                    title: "Coming Soon!",
                    description: `${resource.title} will be available shortly.`,
                  })}
                >
                  Explore Resource
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Need AI-Powered Study Tools?
          </h2>
          <p className="text-foreground/70 mb-6 font-medium">
            Try our AI Study Helper to create summaries, flashcards, quizzes, and get concept explanations instantly.
          </p>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => navigate("/study-helper")}
          >
            Try AI Study Helper
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AcademicResources;