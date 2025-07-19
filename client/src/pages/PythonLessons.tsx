import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  Circle, 
  Play,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Trophy,
  Target,
  Code2,
  BookOpen
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface Lesson {
  id: number;
  chapterId: number;
  title: string;
  type: string;
  content: any;
  orderIndex: number;
  xpReward: number;
}

interface LessonProgress {
  id: number;
  userId: string;
  lessonId: number;
  completed: boolean;
  attempts: number;
  lastAttemptCode?: string;
}

export default function PythonLessons() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Seed course data on first load
  const seedCourseMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/seed-python-course", {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chapters/1/lessons"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
    },
  });

  // Get lessons for chapter 1 (Introduction & Variables)
  const { data: lessons } = useQuery({
    queryKey: ["/api/chapters/1/lessons"],
    enabled: isAuthenticated,
  });

  // Get user lesson progress
  const { data: userProgress } = useQuery({
    queryKey: ["/api/lesson-progress"],
    enabled: isAuthenticated,
  });

  // Execute code mutation
  const executeCodeMutation = useMutation({
    mutationFn: async ({ code, lessonType }: { code: string; lessonType: string }) => {
      const response = await apiRequest("POST", "/api/execute-python", { 
        code, 
        lessonType 
      });
      return response.json();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
    },
  });

  // Update lesson progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (progressData: { lessonId: number; completed: boolean; lastAttemptCode?: string }) => {
      const response = await apiRequest("POST", "/api/lesson-progress", progressData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lesson-progress"] });
      setLessonCompleted(true);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
    },
  });

  // Initialize course if no lessons exist
  useEffect(() => {
    if (isAuthenticated && lessons && lessons.length === 0) {
      seedCourseMutation.mutate();
    }
  }, [isAuthenticated, lessons]);

  if (isLoading || !isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!lessons || lessons.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Setting up your Python course...</h2>
            <Button onClick={() => seedCourseMutation.mutate()} disabled={seedCourseMutation.isPending}>
              {seedCourseMutation.isPending ? "Setting up..." : "Initialize Course"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentLesson: Lesson = lessons[currentLessonIndex];
  const isLastLesson = currentLessonIndex === lessons.length - 1;
  const progressPercentage = ((currentLessonIndex + 1) / lessons.length) * 100;
  
  // Check if current lesson is completed
  const currentLessonProgress = userProgress?.find((p: LessonProgress) => p.lessonId === currentLesson?.id);
  const isCurrentLessonCompleted = currentLessonProgress?.completed || lessonCompleted;

  // Initialize code for code exercises
  useEffect(() => {
    if (currentLesson?.type === "code_exercise" && currentLesson.content.starterCode) {
      setUserCode(currentLessonProgress?.lastAttemptCode || currentLesson.content.starterCode);
    }
    setLessonCompleted(false);
    setSelectedAnswer("");
    setShowHint(false);
  }, [currentLesson, currentLessonProgress]);

  const handleRunCode = () => {
    if (!currentLesson) return;
    executeCodeMutation.mutate({ 
      code: userCode, 
      lessonType: currentLesson.type === "code_exercise" ? "variables" : "general" 
    });
  };

  const handleCompleteLesson = () => {
    if (!currentLesson) return;
    
    updateProgressMutation.mutate({
      lessonId: currentLesson.id,
      completed: true,
      lastAttemptCode: currentLesson.type === "code_exercise" ? userCode : undefined
    });
  };

  const handleNextLesson = () => {
    if (!isLastLesson) {
      setCurrentLessonIndex(prev => prev + 1);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
    }
  };

  const handleQuizAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    if (currentLesson.type === "quiz") {
      const isCorrect = parseInt(answer) === currentLesson.content.correctAnswer;
      if (isCorrect) {
        toast({
          title: "Correct!",
          description: currentLesson.content.explanation,
        });
        handleCompleteLesson();
      } else {
        toast({
          title: "Not quite right",
          description: "Try again! " + (currentLesson.content.explanation || ""),
          variant: "destructive",
        });
      }
    }
  };

  if (!currentLesson) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Python Fundamentals</h1>
              <p className="text-gray-600">Introduction & Variables</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Progress</div>
              <div className="flex items-center space-x-2">
                <Progress value={progressPercentage} className="w-24 h-2" />
                <span className="text-sm font-medium text-gray-900">
                  {currentLessonIndex + 1}/{lessons.length}
                </span>
              </div>
            </div>
          </div>
          
          {/* Lesson Navigation */}
          <div className="flex space-x-2 mb-4 overflow-x-auto">
            {lessons.map((lesson: Lesson, index: number) => {
              const lessonProgress = userProgress?.find((p: LessonProgress) => p.lessonId === lesson.id);
              const isCompleted = lessonProgress?.completed;
              const isCurrent = index === currentLessonIndex;
              
              return (
                <button
                  key={lesson.id}
                  onClick={() => setCurrentLessonIndex(index)}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isCurrent
                      ? "bg-primary text-white"
                      : isCompleted
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {isCompleted && <CheckCircle className="w-4 h-4" />}
                    {lesson.type === "theory" && <BookOpen className="w-4 h-4" />}
                    {lesson.type === "code_exercise" && <Code2 className="w-4 h-4" />}
                    {lesson.type === "quiz" && <Target className="w-4 h-4" />}
                    <span>{lesson.title}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lesson Content */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  {currentLesson.type === "theory" && <BookOpen className="w-5 h-5" />}
                  {currentLesson.type === "code_exercise" && <Code2 className="w-5 h-5" />}
                  {currentLesson.type === "quiz" && <Target className="w-5 h-5" />}
                  <span>{currentLesson.title}</span>
                </CardTitle>
                <CardDescription>
                  {currentLesson.type === "theory" && "Learn the concepts"}
                  {currentLesson.type === "code_exercise" && "Practice coding"}
                  {currentLesson.type === "quiz" && "Test your knowledge"}
                </CardDescription>
              </div>
              <Badge variant="secondary">
                +{currentLesson.xpReward} XP
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Theory Lesson */}
            {currentLesson.type === "theory" && (
              <div>
                <p className="text-gray-700 mb-4">{currentLesson.content.text}</p>
                {currentLesson.content.keyPoints && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Key Points:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {currentLesson.content.keyPoints.map((point: string, index: number) => (
                        <li key={index} className="text-blue-800">{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Code Exercise */}
            {currentLesson.type === "code_exercise" && (
              <div>
                <p className="text-gray-700 mb-4">{currentLesson.content.instructions}</p>
                
                {/* Code Editor */}
                <div className="bg-gray-900 rounded-lg overflow-hidden mb-4">
                  <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                    <span className="text-gray-300 text-sm font-medium">Python</span>
                    <Button 
                      size="sm" 
                      onClick={handleRunCode}
                      disabled={executeCodeMutation.isPending}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {executeCodeMutation.isPending ? "Running..." : "Run Code"}
                    </Button>
                  </div>
                  <Textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    className="bg-gray-900 text-gray-100 border-0 resize-none font-mono text-sm"
                    rows={8}
                    placeholder="Write your Python code here..."
                  />
                </div>

                {/* Output */}
                {executeCodeMutation.data && (
                  <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Output:</h4>
                    <pre className="text-gray-800 text-sm whitespace-pre-wrap font-mono">
                      {executeCodeMutation.data.output}
                    </pre>
                    {executeCodeMutation.data.explanation && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <p className="text-green-800 text-sm">{executeCodeMutation.data.explanation}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Hints */}
                {currentLesson.content.hints && (
                  <div className="mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHint(!showHint)}
                      className="mb-2"
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      {showHint ? "Hide Hint" : "Show Hint"}
                    </Button>
                    {showHint && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                        <ul className="list-disc list-inside space-y-1">
                          {currentLesson.content.hints.map((hint: string, index: number) => (
                            <li key={index} className="text-yellow-800 text-sm">{hint}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Quiz */}
            {currentLesson.type === "quiz" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{currentLesson.content.question}</h3>
                <div className="space-y-3 mb-4">
                  {currentLesson.content.options.map((option: string, index: number) => (
                    <label
                      key={index}
                      className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border transition-colors ${
                        selectedAnswer === index.toString()
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="quiz-answer"
                        value={index.toString()}
                        checked={selectedAnswer === index.toString()}
                        onChange={(e) => handleQuizAnswer(e.target.value)}
                        className="text-primary"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevLesson}
            disabled={currentLessonIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-4">
            {!isCurrentLessonCompleted && (
              <Button
                onClick={handleCompleteLesson}
                disabled={updateProgressMutation.isPending}
                variant="secondary"
              >
                <Trophy className="w-4 h-4 mr-2" />
                {updateProgressMutation.isPending ? "Completing..." : "Complete Lesson"}
              </Button>
            )}

            <Button
              onClick={handleNextLesson}
              disabled={isLastLesson}
            >
              {isLastLesson ? "Course Complete" : "Next"}
              {!isLastLesson && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="ghost">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}