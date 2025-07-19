import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import CodeEditor from "@/components/CodeEditor";
import QuizModal from "@/components/QuizModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { 
  CheckCircle, 
  Circle, 
  Lightbulb, 
  ChevronLeft, 
  ChevronRight,
  RotateCcw,
  Play
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function PythonCourse() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [showQuiz, setShowQuiz] = useState(false);
  const [code, setCode] = useState(`# Write your Python code here
def calculate_grade(score):
    # Complete this function to return a letter grade
    # A: 90+, B: 80-89, C: 70-79, D: 60-69, F: Below 60
    pass

# Test your function
print(calculate_grade(85))
print(calculate_grade(92))
print(calculate_grade(67))`);
  const [output, setOutput] = useState("# Click 'Run Code' to see the output");

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

  const executeCodeMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("POST", "/api/execute-python", { code });
      return response.json();
    },
    onSuccess: (data) => {
      setOutput(data.output || "Code executed successfully");
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
      setOutput("Error executing code. Please try again.");
    },
  });

  const handleRunCode = () => {
    executeCodeMutation.mutate(code);
  };

  const handleResetCode = () => {
    setCode(`# Write your Python code here
def calculate_grade(score):
    # Complete this function to return a letter grade
    # A: 90+, B: 80-89, C: 70-79, D: 60-69, F: Below 60
    pass

# Test your function
print(calculate_grade(85))
print(calculate_grade(92))
print(calculate_grade(67))`);
    setOutput("# Click 'Run Code' to see the output");
  };

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  const learningObjectives = [
    { text: "Understand function definition and parameters", completed: true },
    { text: "Master if/else conditional statements", completed: true },
    { text: "Implement loops and iteration patterns", completed: false },
    { text: "Handle exceptions and error cases", completed: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Programming Languages</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Python Fundamentals</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Course Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Python Fundamentals</h2>
            <p className="text-gray-600">Chapter 3: Functions and Control Flow</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">Course Progress</div>
            <div className="flex items-center space-x-2">
              <Progress value={45} className="w-24 h-2" />
              <span className="text-sm font-medium text-gray-900">45%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lesson Content */}
          <div className="space-y-6">
            {/* Learning Objectives */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      {objective.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 mt-0.5" />
                      )}
                      <span className={objective.completed ? "text-gray-900" : "text-gray-600"}>
                        {objective.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Lesson Content */}
            <Card>
              <CardHeader>
                <CardTitle>Lesson Content</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Functions in Python</h4>
                <p className="text-gray-600 mb-4">
                  Functions are reusable blocks of code that perform specific tasks. They help organize your code and avoid repetition.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4 font-mono text-sm">
                  <pre><code>{`def greet(name):
    return f"Hello, {name}!"

# Call the function
message = greet("Alice")
print(message)`}</code></pre>
                </div>

                <h4 className="text-lg font-semibold text-gray-900 mb-2">Conditional Statements</h4>
                <p className="text-gray-600 mb-4">
                  Use if/else statements to make decisions in your code based on different conditions.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4 font-mono text-sm">
                  <pre><code>{`age = 18
if age >= 18:
    print("You can vote!")
else:
    print("Wait until you're 18")`}</code></pre>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex space-x-4">
              <Button variant="outline" className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous Lesson
              </Button>
              <Button className="flex-1" onClick={() => setShowQuiz(true)}>
                Next Lesson
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Interactive Code Editor */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Practice Exercise</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={handleResetCode}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleRunCode}
                      disabled={executeCodeMutation.isPending}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {executeCodeMutation.isPending ? "Running..." : "Run Code"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <CodeEditor value={code} onChange={setCode} />
                <div className="bg-gray-900 text-green-400 p-4 font-mono text-sm min-h-20">
                  <div className="text-gray-500 mb-1">Output:</div>
                  <div className="whitespace-pre-wrap">{output}</div>
                </div>
              </CardContent>
            </Card>

            {/* Hint */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <div className="flex">
                <Lightbulb className="w-5 h-5 text-blue-400 mr-3 mt-1" />
                <div>
                  <h4 className="text-blue-900 font-semibold mb-1">Hint</h4>
                  <p className="text-blue-800 text-sm">
                    Use if/elif/else statements to check the score ranges. Remember that you can use comparison operators like {'>='}  and {'<'}.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Check */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Check</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-700 mb-3">Which keyword is used to define a function in Python?</p>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="quiz1" value="function" className="text-primary" />
                        <span className="text-gray-700">function</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="quiz1" value="def" className="text-primary" />
                        <span className="text-gray-700">def</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="quiz1" value="define" className="text-primary" />
                        <span className="text-gray-700">define</span>
                      </label>
                    </div>
                  </div>
                  <Button className="w-full">Submit Answer</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <QuizModal 
          isOpen={showQuiz} 
          onClose={() => setShowQuiz(false)}
          questionNumber={2}
          totalQuestions={5}
          timeRemaining="2:34"
        />
      )}
    </div>
  );
}
