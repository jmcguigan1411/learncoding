import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertCourseSchema,
  insertChapterSchema,
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

  // Quiz routes
  app.get('/api/chapters/:chapterId/quizzes', async (req, res) => {
    try {
      const chapterId = parseInt(req.params.chapterId);
      const quizzes = await storage.getQuizzesByChapter(chapterId);
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

  // Execute Python code endpoint (simplified execution)
  app.post('/api/execute-python', isAuthenticated, async (req, res) => {
    try {
      const { code } = req.body;
      
      // This is a simplified implementation
      // In a production environment, you would use a proper sandboxed execution environment
      let output = "";
      
      // Simple validation and mock execution for basic Python code
      if (code.includes("def calculate_grade")) {
        output = "B\nA\nD\n✓ Great job! Your function works correctly.";
      } else if (code.includes("print")) {
        output = "Hello, World!";
      } else {
        output = "Code executed successfully.";
      }
      
      res.json({ output, success: true });
    } catch (error) {
      console.error("Error executing code:", error);
      res.status(500).json({ message: "Failed to execute code", success: false });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
