export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: string;
  isVerified: boolean;
  studentId?: string;
  teacherId?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorId: string;
  thumbnail: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  rating: number;
  totalRatings: number;
  price: number;
  isFree: boolean;
  enrolledCount: number;
  lessons: Lesson[];
  createdAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  content: string;
  duration?: number;
  order: number;
  isCompleted?: boolean;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'exam' | 'assignment';
  subject: string;
  level: string;
  duration: number; // in minutes
  totalQuestions: number;
  questions: Question[];
  createdAt: string;
  dueDate?: string;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  explanation?: string;
}

export interface ExamPaper {
  id: string;
  title: string;
  subject: string;
  year: number;
  level: 'BGCSE' | 'JCE' | 'PSLE';
  fileUrl: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  response: string;
  timestamp: string;
  attachments?: string[];
}

export interface StudySession {
  id: string;
  userId: string;
  topic: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  startedAt: string;
  completedAt?: string;
  isCompleted: boolean;
}

export interface MindMap {
  id: string;
  title: string;
  topic: string;
  data: any; // Mind map data structure
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  members: string[];
  adminId: string;
  createdAt: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  subject?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  type: 'badge' | 'achievement' | 'points';
  unlockedAt?: string;
}

export interface Podcast {
  id: string;
  title: string;
  description: string;
  topic: string;
  duration: number;
  audioUrl: string;
  thumbnail: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: 'class' | 'exam' | 'assignment' | 'event';
  startTime: string;
  endTime: string;
  location?: string;
  reminder?: boolean;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  category: string;
  seller: string;
  rating: number;
  downloads: number;
}

