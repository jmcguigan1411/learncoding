import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Clock } from "lucide-react";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionNumber: number;
  totalQuestions: number;
  timeRemaining: string;
}

export default function QuizModal({
  isOpen,
  onClose,
  questionNumber,
  totalQuestions,
  timeRemaining
}: QuizModalProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  const question = {
    text: "What will this code output?",
    code: `def calculate(x, y=5):
    return x * y

print(calculate(3))
print(calculate(3, 2))`,
    options: [
      { id: "a", text: "15\n6" },
      { id: "b", text: "8\n5" },
      { id: "c", text: "3\n6" },
      { id: "d", text: "Error - missing parameter" }
    ],
    correctAnswer: "a"
  };

  const progress = (questionNumber / totalQuestions) * 100;

  const handleNext = () => {
    // Handle quiz logic here
    if (questionNumber < totalQuestions) {
      // Go to next question
    } else {
      // Complete quiz
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Chapter 3 Quiz</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {questionNumber} of {totalQuestions}</span>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Time: {timeRemaining}</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">{question.text}</h4>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
            <pre><code>{question.code}</code></pre>
          </div>
          
          <div className="space-y-3">
            {question.options.map((option) => (
              <label
                key={option.id}
                className={`flex items-start space-x-3 cursor-pointer p-3 rounded-lg border hover:bg-gray-50 transition-colors ${
                  selectedAnswer === option.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="quiz-answer"
                  value={option.id}
                  checked={selectedAnswer === option.id}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  className="mt-1"
                />
                <span className="text-gray-700 whitespace-pre-line">{option.text}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            className="flex-1"
            disabled={questionNumber === 1}
          >
            Previous
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleNext}
            disabled={!selectedAnswer}
          >
            {questionNumber < totalQuestions ? 'Next Question' : 'Complete Quiz'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
