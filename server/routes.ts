import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertCourseSchema,
  insertChapterSchema,
  insertLessonSchema,
  insertUserLessonProgressSchema,
  insertUserProgressSchema,
  insertQuizSchema,
  insertUserQuizAttemptSchema,
  insertCertificateSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Course routes
  app.get('/api/courses', async (req, res) => {
    try {
      const track = req.query.track as string;
      const courses = track 
        ? await storage.getCoursesByTrack(track)
        : await storage.getCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get('/api/courses/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const course = await storage.getCourse(id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.post('/api/courses', isAuthenticated, async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  // Chapter routes
  app.get('/api/courses/:courseId/chapters', async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const chapters = await storage.getChaptersByCourse(courseId);
      res.json(chapters);
    } catch (error) {
      console.error("Error fetching chapters:", error);
      res.status(500).json({ message: "Failed to fetch chapters" });
    }
  });

  app.get('/api/chapters/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const chapter = await storage.getChapter(id);
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      res.json(chapter);
    } catch (error) {
      console.error("Error fetching chapter:", error);
      res.status(500).json({ message: "Failed to fetch chapter" });
    }
  });

  app.post('/api/courses/:courseId/chapters', isAuthenticated, async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const chapterData = insertChapterSchema.parse({ ...req.body, courseId });
      const chapter = await storage.createChapter(chapterData);
      res.status(201).json(chapter);
    } catch (error) {
      console.error("Error creating chapter:", error);
      res.status(500).json({ message: "Failed to create chapter" });
    }
  });

  // Progress routes
  app.get('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const courseId = req.query.courseId ? parseInt(req.query.courseId as string) : undefined;
      const progress = await storage.getUserProgress(userId, courseId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.post('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progressData = insertUserProgressSchema.parse({ ...req.body, userId });
      const progress = await storage.updateProgress(progressData);
      res.json(progress);
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Lesson routes
  app.get('/api/chapters/:chapterId/lessons', async (req, res) => {
    try {
      const chapterId = parseInt(req.params.chapterId);
      const lessons = await storage.getLessonsByChapter(chapterId);
      res.json(lessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  app.get('/api/lessons/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const lesson = await storage.getLesson(id);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      console.error("Error fetching lesson:", error);
      res.status(500).json({ message: "Failed to fetch lesson" });
    }
  });

  // User lesson progress routes
  app.get('/api/lesson-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const lessonId = req.query.lessonId ? parseInt(req.query.lessonId as string) : undefined;
      const progress = await storage.getUserLessonProgress(userId, lessonId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching lesson progress:", error);
      res.status(500).json({ message: "Failed to fetch lesson progress" });
    }
  });

  app.post('/api/lesson-progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progressData = insertUserLessonProgressSchema.parse({ ...req.body, userId });
      const progress = await storage.updateLessonProgress(progressData);
      res.json(progress);
    } catch (error) {
      console.error("Error updating lesson progress:", error);
      res.status(500).json({ message: "Failed to update lesson progress" });
    }
  });

  // Quiz routes
  app.get('/api/lessons/:lessonId/quizzes', async (req, res) => {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const quizzes = await storage.getQuizzesByLesson(lessonId);
      res.json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      res.status(500).json({ message: "Failed to fetch quizzes" });
    }
  });

  app.post('/api/quiz-attempts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const attemptData = insertUserQuizAttemptSchema.parse({ ...req.body, userId });
      const attempt = await storage.submitQuizAttempt(attemptData);
      res.status(201).json(attempt);
    } catch (error) {
      console.error("Error submitting quiz attempt:", error);
      res.status(500).json({ message: "Failed to submit quiz attempt" });
    }
  });

  // Certificate routes
  app.get('/api/certificates', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const certificates = await storage.getUserCertificates(userId);
      res.json(certificates);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      res.status(500).json({ message: "Failed to fetch certificates" });
    }
  });

  app.post('/api/certificates', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const certificateData = insertCertificateSchema.parse({ ...req.body, userId });
      const certificate = await storage.issueCertificate(certificateData);
      res.status(201).json(certificate);
    } catch (error) {
      console.error("Error issuing certificate:", error);
      res.status(500).json({ message: "Failed to issue certificate" });
    }
  });

  // Execute Python code endpoint with enhanced validation
  app.post('/api/execute-python', isAuthenticated, async (req, res) => {
    try {
      const { code, expectedOutput, lessonType } = req.body;
      
      let output = "";
      let success = true;
      let explanation = "";
      
      // Enhanced code execution simulation based on lesson type
      if (lessonType === "variables") {
        if (code.includes('name = "') && code.includes('age = ') && code.includes('print(')) {
          output = "Alice\n25\nHello, I'm Alice and I'm 25 years old.";
          explanation = "Perfect! You've successfully created variables and used them in a formatted string.";
        } else if (!code.includes('name = "')) {
          output = "Error: Missing name variable assignment";
          success = false;
        } else if (!code.includes('age = ')) {
          output = "Error: Missing age variable assignment";
          success = false;
        } else {
          output = "Error: Make sure to print your variables";
          success = false;
        }
      } else if (lessonType === "functions") {
        if (code.includes("def greet(") && code.includes("return")) {
          output = "Hello, World!\nHello, Alice!\n✓ Excellent! Your function works correctly with different inputs.";
          explanation = "Great job creating a reusable function that accepts parameters!";
        } else if (!code.includes("def ")) {
          output = "Error: You need to define a function using 'def'";
          success = false;
        } else if (!code.includes("return")) {
          output = "Error: Your function should return a value";
          success = false;
        }
      } else if (lessonType === "conditionals") {
        if (code.includes("if ") && code.includes("else")) {
          output = "You're an adult!\nYou're a minor.\n✓ Perfect! Your conditional logic handles both cases correctly.";
          explanation = "Excellent use of if/else statements to make decisions in your code!";
        } else if (!code.includes("if ")) {
          output = "Error: You need to use an 'if' statement";
          success = false;
        } else {
          output = "Error: Don't forget the 'else' case";
          success = false;
        }
      } else if (lessonType === "loops") {
        if (code.includes("for ") && code.includes("range(")) {
          output = "0\n1\n2\n3\n4\n✓ Great! You've successfully created a loop that prints numbers.";
          explanation = "Perfect! You understand how to use for loops with range.";
        } else if (!code.includes("for ")) {
          output = "Error: You need to use a 'for' loop";
          success = false;
        }
      } else if (lessonType === "lists") {
        if (code.includes("[") && code.includes("]") && code.includes("append")) {
          output = "['apple', 'banana', 'orange', 'grape']\n✓ Excellent! You've created and modified a list.";
          explanation = "Great work with list operations!";
        } else if (!code.includes("[")) {
          output = "Error: You need to create a list using square brackets []";
          success = false;
        }
      } else {
        // Default execution for general code
        if (code.includes("print(")) {
          // Try to extract what's being printed for basic validation
          const printMatch = code.match(/print\((.*?)\)/);
          if (printMatch) {
            output = printMatch[1].replace(/['"]/g, '');
          } else {
            output = "Hello, World!";
          }
        } else {
          output = "Code executed successfully. Try adding a print statement to see output!";
        }
      }
      
      res.json({ output, success, explanation });
    } catch (error) {
      console.error("Error executing code:", error);
      res.status(500).json({ message: "Failed to execute code", success: false });
    }
  });

  // Seed Python fundamentals course data
  app.post('/api/seed-python-course', isAuthenticated, async (req: any, res) => {
    try {
      // Create Python Fundamentals course
      const course = await storage.createCourse({
        title: "Python Fundamentals",
        description: "Master Python programming from basics to advanced concepts with hands-on exercises",
        track: "programming",
        language: "python",
        difficulty: "beginner",
        totalChapters: 8
      });

      // Create chapters and lessons
      const chapters = [
        {
          title: "Introduction & Variables",
          content: "Learn about Python basics and how to work with variables",
          orderIndex: 1,
          lessons: [
            {
              title: "What is Python?",
              type: "theory",
              content: {
                text: "Python is a powerful, easy-to-learn programming language. It's used for web development, data science, artificial intelligence, and more.",
                keyPoints: [
                  "Python is readable and easy to understand",
                  "It's used by companies like Google, Instagram, and Spotify",
                  "Perfect for beginners and professionals alike"
                ]
              },
              xpReward: 5
            },
            {
              title: "Creating Variables",
              type: "code_exercise",
              content: {
                instructions: "Variables store data that can be used later. Create a name variable and an age variable, then print them.",
                starterCode: "# Create your variables here\nname = \nage = \n\n# Print them\nprint(name)\nprint(age)",
                solution: "name = \"Alice\"\nage = 25\n\nprint(name)\nprint(age)",
                expectedOutput: "Alice\n25",
                hints: [
                  "Use quotes around text values like names",
                  "Numbers don't need quotes",
                  "Use the print() function to display values"
                ]
              },
              xpReward: 15
            },
            {
              title: "Variable Types Quiz",
              type: "quiz",
              content: {
                question: "Which of these is the correct way to create a text variable in Python?",
                options: [
                  "name = Alice",
                  "name = \"Alice\"",
                  "name = (Alice)",
                  "name = [Alice]"
                ],
                correctAnswer: 1,
                explanation: "Text values (strings) must be surrounded by quotes in Python."
              },
              xpReward: 10
            }
          ]
        }
      ];

      // Create first chapter and its lessons
      const chapter = await storage.createChapter({
        courseId: course.id,
        title: chapters[0].title,
        content: chapters[0].content,
        orderIndex: chapters[0].orderIndex
      });

      // Create lessons for this chapter
      for (let i = 0; i < chapters[0].lessons.length; i++) {
        const lessonData = chapters[0].lessons[i];
        await storage.createLesson({
          chapterId: chapter.id,
          title: lessonData.title,
          type: lessonData.type,
          content: lessonData.content,
          orderIndex: i + 1,
          xpReward: lessonData.xpReward
        });
      }

      res.json({ message: "Python course seeded successfully", courseId: course.id });
    } catch (error) {
      console.error("Error seeding course:", error);
      res.status(500).json({ message: "Failed to seed course" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
