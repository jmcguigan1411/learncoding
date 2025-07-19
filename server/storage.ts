import {
  users,
  courses,
  chapters,
  userProgress,
  quizzes,
  userQuizAttempts,
  certificates,
  type User,
  type UpsertUser,
  type Course,
  type InsertCourse,
  type Chapter,
  type InsertChapter,
  type UserProgress,
  type InsertUserProgress,
  type Quiz,
  type InsertQuiz,
  type UserQuizAttempt,
  type InsertUserQuizAttempt,
  type Certificate,
  type InsertCertificate,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Course operations
  getCourses(): Promise<Course[]>;
  getCoursesByTrack(track: string): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Chapter operations
  getChaptersByCourse(courseId: number): Promise<Chapter[]>;
  getChapter(id: number): Promise<Chapter | undefined>;
  createChapter(chapter: InsertChapter): Promise<Chapter>;
  
  // Progress operations
  getUserProgress(userId: string, courseId?: number): Promise<UserProgress[]>;
  updateProgress(progress: InsertUserProgress): Promise<UserProgress>;
  
  // Quiz operations
  getQuizzesByChapter(chapterId: number): Promise<Quiz[]>;
  getQuiz(id: number): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  
  // Quiz attempt operations
  submitQuizAttempt(attempt: InsertUserQuizAttempt): Promise<UserQuizAttempt>;
  getUserQuizAttempts(userId: string, quizId?: number): Promise<UserQuizAttempt[]>;
  
  // Certificate operations
  issueCertificate(certificate: InsertCertificate): Promise<Certificate>;
  getUserCertificates(userId: string): Promise<Certificate[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Course operations
  async getCourses(): Promise<Course[]> {
    return await db.select().from(courses).orderBy(courses.title);
  }

  async getCoursesByTrack(track: string): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.track, track)).orderBy(courses.title);
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  // Chapter operations
  async getChaptersByCourse(courseId: number): Promise<Chapter[]> {
    return await db
      .select()
      .from(chapters)
      .where(eq(chapters.courseId, courseId))
      .orderBy(chapters.orderIndex);
  }

  async getChapter(id: number): Promise<Chapter | undefined> {
    const [chapter] = await db.select().from(chapters).where(eq(chapters.id, id));
    return chapter;
  }

  async createChapter(chapter: InsertChapter): Promise<Chapter> {
    const [newChapter] = await db.insert(chapters).values(chapter).returning();
    return newChapter;
  }

  // Progress operations
  async getUserProgress(userId: string, courseId?: number): Promise<UserProgress[]> {
    if (courseId) {
      return await db
        .select()
        .from(userProgress)
        .where(and(eq(userProgress.userId, userId), eq(userProgress.courseId, courseId)))
        .orderBy(desc(userProgress.createdAt));
    }
    
    return await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .orderBy(desc(userProgress.createdAt));
  }

  async updateProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const [existingProgress] = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, progress.userId!),
          eq(userProgress.chapterId, progress.chapterId!)
        )
      );

    if (existingProgress) {
      const [updatedProgress] = await db
        .update(userProgress)
        .set({ ...progress, completedAt: progress.completed ? new Date() : null })
        .where(eq(userProgress.id, existingProgress.id))
        .returning();
      return updatedProgress;
    } else {
      const [newProgress] = await db
        .insert(userProgress)
        .values({ ...progress, completedAt: progress.completed ? new Date() : null })
        .returning();
      return newProgress;
    }
  }

  // Quiz operations
  async getQuizzesByChapter(chapterId: number): Promise<Quiz[]> {
    return await db.select().from(quizzes).where(eq(quizzes.chapterId, chapterId));
  }

  async getQuiz(id: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz;
  }

  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const [newQuiz] = await db.insert(quizzes).values(quiz).returning();
    return newQuiz;
  }

  // Quiz attempt operations
  async submitQuizAttempt(attempt: InsertUserQuizAttempt): Promise<UserQuizAttempt> {
    const [newAttempt] = await db.insert(userQuizAttempts).values(attempt).returning();
    return newAttempt;
  }

  async getUserQuizAttempts(userId: string, quizId?: number): Promise<UserQuizAttempt[]> {
    if (quizId) {
      return await db
        .select()
        .from(userQuizAttempts)
        .where(and(eq(userQuizAttempts.userId, userId), eq(userQuizAttempts.quizId, quizId)))
        .orderBy(desc(userQuizAttempts.attemptedAt));
    }
    
    return await db
      .select()
      .from(userQuizAttempts)
      .where(eq(userQuizAttempts.userId, userId))
      .orderBy(desc(userQuizAttempts.attemptedAt));
  }

  // Certificate operations
  async issueCertificate(certificate: InsertCertificate): Promise<Certificate> {
    const [newCertificate] = await db.insert(certificates).values(certificate).returning();
    return newCertificate;
  }

  async getUserCertificates(userId: string): Promise<Certificate[]> {
    return await db
      .select()
      .from(certificates)
      .where(eq(certificates.userId, userId))
      .orderBy(desc(certificates.issuedAt));
  }
}

export const storage = new DatabaseStorage();
