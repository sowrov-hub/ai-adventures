import type { ReactNode } from 'react';
import type { Chat } from '@google/genai';

export enum ModuleKey {
  WELCOME = 'WELCOME',
  PROMPT_ENGINEERING_COURSE = 'PROMPT_ENGINEERING_COURSE',
  PROMPTING_FUN = 'PROMPTING_FUN',
  IMAGE_MAGIC = 'IMAGE_MAGIC',
  STORY_TIME = 'STORY_TIME',
  ART_STUDIO = 'ART_STUDIO',
  CODE_WIZARDS = 'CODE_WIZARDS',
  SCHOOL_HELPER = 'SCHOOL_HELPER',
}

export interface Module {
  key: ModuleKey;
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  component: React.FC<any>;
}

export interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export interface ChatState {
    chat: Chat | null;
    history: Message[];
    isLoading: boolean;
}

export interface QuizData {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
}

export interface LessonData {
    title: string;
    content: React.FC;
    quiz?: QuizData;
}