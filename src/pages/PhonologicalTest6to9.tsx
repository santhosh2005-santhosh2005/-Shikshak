
import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Volume2 } from "lucide-react";

const PhonologicalTest6to9 = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const navigate = useNavigate();

  const questions = [
    {
      id: 1,
      sound: "Listen: CAT",
      question: "Which picture starts with the same sound as CAT?",
      options: [
        { text: "Dog", emoji: "🐕", correct: false },
        { text: "Car", emoji: "🚗", correct: true },
        { text: "Ball", emoji: "⚽", correct: false },
        { text: "Fish", emoji: "🐟", correct: false }
      ]
    },
    {
      id: 2,
      sound: "Listen: SUN",
      question: "Which picture starts with the same sound as SUN?",
      options: [
        { text: "Moon", emoji: "🌙", correct: false },
        { text: "Star", emoji: "⭐", correct: true },
        { text: "Tree", emoji: "🌳", correct: false },
        { text: "House", emoji: "🏠", correct: false }
      ]
    },
    {
      id: 3,
      sound: "Listen: BALL",
      question: "Which picture starts with the same sound as BALL?",
      options: [
        { text: "Car", emoji: "🚗", correct: false },
        { text: "Book", emoji: "📚", correct: true },
        { text: "Apple", emoji: "🍎", correct: false },
        { text: "Dog", emoji: "🐕", correct: false }
      ]
    },
    {
      id: 4,
      sound: "Listen: DUCK",
      question: "Which picture starts with the same sound as DUCK?",
      options: [
        { text: "Cat", emoji: "🐱", correct: false },
        { text: "Frog", emoji: "🐸", correct: false },
        { text: "Door", emoji: "🚪", correct: true },
        { text: "Bike", emoji: "🚲", correct: false }
      ]
    }
  ];

  const handleAnswerSelect = (option: any) => {
    setSelectedAnswer(option.text);
  };

  const handleNext = () => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer("");
  
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const score = newAnswers.reduce((acc, answer, index) => {
        const correctAnswer = questions[index].options.find(opt => opt.correct)?.text;
        return acc + (answer === correctAnswer ? 1 : 0);
      }, 0);
  
      const detailedResults = questions.map((q, idx) => {
        const correctAnswer = q.options.find(opt => opt.correct)?.text;
        return {
          questionIndex: idx + 1,
          isCorrect: newAnswers[idx] === correctAnswer,
          timeSpent: 0,
          difficulty: "Normal"
        };
      });
  
      localStorage.setItem("testResults", JSON.stringify({
        test: "Sound Games (Ages 6–9)",
        accuracy: Math.round((score / questions.length) * 100),
        averageTime: 0,
        timeScore: 0,
        riskFactors: [],
        riskLevel: score >= 3 ? "Low" : score >= 2 ? "Moderate" : "High",
        correctAnswers: score,
        totalQuestions: questions.length,
        detailedResults
      }));
  
      navigate("/results");
    }
  };
  

  const getRecommendations = (score: number) => {
    if (score >= 3) {
      return "Excellent! You're great at hearing the sounds in words. Keep playing with rhyming games!";
    } else if (score >= 2) {
      return "Good job! Practice saying words slowly and listening to the first sound. Try rhyming games!";
    } else {
      return "Let's practice together! Play word games and ask a grown-up to help you hear sounds in words.";
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const currentQ = questions[currentQuestion];
    if (currentQ) {
      setTimeout(() => {
        speakText(currentQ.sound + ". " + currentQ.question);
      }, 500);
    }
  }, [currentQuestion]);

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
                Sound Games
              </CardTitle>
              <p className="text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </p>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="text-lg font-semibold bg-primary/10 px-4 py-2 rounded-lg">
                    🔊 {questions[currentQuestion].sound}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakText(questions[currentQuestion].sound)}
                    className="text-primary hover:text-primary/80"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <h3 className="text-xl font-semibold mb-6">
                  {questions[currentQuestion].question}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((option) => (
                  <Button
                    key={option.text}
                    variant={selectedAnswer === option.text ? "default" : "outline"}
                    size="lg"
                    onClick={() => handleAnswerSelect(option)}
                    className="p-6 h-auto flex flex-col gap-2"
                  >
                    <div className="text-3xl">{option.emoji}</div>
                    <div className="text-lg">{option.text}</div>
                  </Button>
                ))}
              </div>

              <div className="text-center">
                <Button
                  onClick={handleNext}
                  disabled={!selectedAnswer}
                  size="lg"
                  className="px-8"
                >
                  {currentQuestion === questions.length - 1 ? "Finish Game!" : "Next Question"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 p-4 bg-card rounded-lg border">
            <p className="text-sm text-muted-foreground text-center">
              🎵 <strong>Tip:</strong> Listen carefully to the first sound of each word! 
              Click the speaker to hear it again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhonologicalTest6to9;
