
import React from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const MemoryTest9to12 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/tests')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tests
            </Button>
          </div>

          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-primary">
                Remember & Repeat Test
              </CardTitle>
              <p className="text-muted-foreground">
                Coming soon! This test will assess your working memory with age-appropriate challenges.
              </p>
            </CardHeader>

            <CardContent className="text-center space-y-8">
              <div className="text-6xl mb-4">🧠</div>
              <p className="text-lg text-muted-foreground">
                We're creating a comprehensive memory assessment designed specifically for your age group!
              </p>
              <Button
                onClick={() => navigate('/tests')}
                size="lg"
                className="px-8"
              >
                Try Other Tests
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemoryTest9to12;
