export interface Lesson {
  id: string;
  title: string;
  duration: string;
  content?: string;
  isGenerating?: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  title: string;
  subtitle: string;
  description: string;
  modules: Module[];
  instructor: string;
  targetAudience: string;
  difficulty: string;
  totalDuration: string;
}
