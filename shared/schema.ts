import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  xp: integer("xp").default(0),
  level: integer("level").default(1),
  streakDays: integer("streak_days").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  track: varchar("track").notNull(), // programming, devops, architecture
  language: varchar("language"), // for programming courses
  difficulty: varchar("difficulty").notNull(), // beginner, intermediate, advanced
  totalChapters: integer("total_chapters").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chapters = pgTable("chapters", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id),
  title: varchar("title").notNull(),
  content: text("content"),
  codeExample: text("code_example"),
  exercise: text("exercise"),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Interactive lessons within chapters
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  chapterId: integer("chapter_id").references(() => chapters.id),
  title: varchar("title").notNull(),
  type: varchar("type").notNull(), // theory, code_exercise, quiz, fill_blank, drag_drop
  content: jsonb("content").notNull(), // lesson structure and data
  orderIndex: integer("order_index").notNull(),
  xpReward: integer("xp_reward").default(10),
  createdAt: timestamp("created_at").defaultNow(),
});

// User progress on individual lessons
export const userLessonProgress = pgTable("user_lesson_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  lessonId: integer("lesson_id").references(() => lessons.id),
  completed: boolean("completed").default(false),
  attempts: integer("attempts").default(0),
  lastAttemptCode: text("last_attempt_code"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  courseId: integer("course_id").references(() => courses.id),
  chapterId: integer("chapter_id").references(() => chapters.id),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").references(() => lessons.id),
  questionType: varchar("question_type").notNull(), // multiple_choice, code_completion, syntax_check, semantic_understanding
  question: text("question").notNull(),
  codeSnippet: text("code_snippet"), // for code-based questions
  options: jsonb("options"), // array of options for multiple choice
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"),
  hints: jsonb("hints"), // array of progressive hints
  createdAt: timestamp("created_at").defaultNow(),
});

export const userQuizAttempts = pgTable("user_quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  quizId: integer("quiz_id").references(() => quizzes.id),
  selectedAnswer: integer("selected_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  attemptedAt: timestamp("attempted_at").defaultNow(),
});

export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  courseId: integer("course_id").references(() => courses.id),
  issuedAt: timestamp("issued_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
});

export const insertChapterSchema = createInsertSchema(chapters).omit({
  id: true,
  createdAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  createdAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
});

export const insertUserLessonProgressSchema = createInsertSchema(userLessonProgress).omit({
  id: true,
  createdAt: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
});

export const insertUserQuizAttemptSchema = createInsertSchema(userQuizAttempts).omit({
  id: true,
});

export const insertCertificateSchema = createInsertSchema(certificates).omit({
  id: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;
export type InsertChapter = z.infer<typeof insertChapterSchema>;
export type Chapter = typeof chapters.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;
export type InsertUserLessonProgress = z.infer<typeof insertUserLessonProgressSchema>;
export type UserLessonProgress = typeof userLessonProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;
export type InsertUserQuizAttempt = z.infer<typeof insertUserQuizAttemptSchema>;
export type UserQuizAttempt = typeof userQuizAttempts.$inferSelect;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type Certificate = typeof certificates.$inferSelect;
