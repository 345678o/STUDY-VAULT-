import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Search, CheckCircle, Brain, ArrowRight, Play, Users, Target, BookOpen, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";
import heroBanner from "@/assets/hero-banner.jpg";
import heroStudyingBg from "@/assets/hero-studying-background.jpg";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const { toast } = useToast();
  const features = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Centralized Notes",
      description: "Access organized study materials from all years and subjects in one place"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Peer-Verified Content",
      description: "Quality-checked notes and materials shared by successful students"
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "Smart Search",
      description: "Find exactly what you need with powerful search and filtering tools"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Backlog-Friendly Access",
      description: "Specially designed tools to help you catch up and get back on track"
    }
  ];

  const steps = [
    {
      icon: <Upload className="h-12 w-12" />,
      title: "Upload",
      description: "Share your notes and access others' materials"
    },
    {
      icon: <Search className="h-12 w-12" />,
      title: "Organize",
      description: "Smart categorization by year, subject, and topic"
    },
    {
      icon: <CheckCircle className="h-12 w-12" />,
      title: "Access Anytime",
      description: "Study materials available 24/7 from anywhere"
    }
  ];

  const tools = [
    {
      icon: <Upload className="h-6 w-6" />,
      title: "Upload Notes",
      color: "text-primary"
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Search & Filter",
      color: "text-accent"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Backlog Recovery Tools",
      color: "text-secondary"
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI Summaries & Quizzes",
      color: "text-primary"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25"></div>
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroStudyingBg})` }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4" />
              Your Academic Success Partner
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Your Backlog
              <br />
              Rescue Hub
            </h1>
            
            <p className="text-xl md:text-2xl mb-4 text-foreground font-semibold">
              Access organized notes, lectures, and study materials — year by year.
            </p>
            
            <p className="text-lg mb-10 text-foreground font-medium max-w-2xl mx-auto">
              Transform your academic journey with comprehensive resources, expert support, 
              and cutting-edge tools designed to help students overcome challenges and excel.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-4 bg-primary hover:bg-primary-dark shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => toast({
                  title: "Explore Notes",
                  description: "Notes library will be available soon!",
                })}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Explore Notes
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4 border-2 border-accent text-accent hover:bg-accent hover:text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => toast({
                  title: "Upload Notes",
                  description: "Note upload feature coming soon!",
                })}
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Your Notes
              </Button>
            </div>

            {/* Tool Icons */}
            <div className="flex justify-center items-center gap-8 mt-16 pt-8 border-t border-border/50">
              {tools.map((tool, index) => (
                <div key={index} className="flex items-center gap-2 text-sm font-medium">
                  <div className={`${tool.color} bg-current/10 p-2 rounded-lg`}>
                    {tool.icon}
                  </div>
                  <span className="text-foreground font-medium hidden sm:inline">{tool.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-foreground font-medium max-w-2xl mx-auto">
              Simple steps to transform your study experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative">
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-primary">{step.icon}</div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-full w-full">
                      <ArrowRight className="h-6 w-6 text-muted-foreground mx-auto -translate-x-12" />
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-foreground font-medium text-lg">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-foreground font-medium max-w-2xl mx-auto">
              Comprehensive academic support designed specifically for students who want to catch up and get ahead
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group border-2 hover:border-primary/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-primary">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-foreground font-medium">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">10,000+</div>
              <p className="text-foreground text-lg font-semibold">Students Helped</p>
            </div>
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold text-accent mb-2 group-hover:scale-110 transition-transform duration-300">95%</div>
              <p className="text-foreground text-lg font-semibold">Success Rate</p>
            </div>
            <div className="group">
              <div className="text-5xl md:text-6xl font-bold text-secondary mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
              <p className="text-foreground text-lg font-semibold">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-primary via-accent to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Start Catching Up Today!
          </h2>
          <p className="text-xl text-white/90 mb-10 font-medium">
            Join thousands of students who have successfully caught up and gotten ahead with StudyVault
          </p>
          <Button 
            size="lg" 
            className="text-xl px-12 py-6 bg-white text-primary hover:bg-white/90 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
            onClick={() => toast({
              title: "Get Started!",
              description: "Your success story begins here!",
            })}
          >
            <Play className="mr-3 h-6 w-6" />
            Begin Your Success Story
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;