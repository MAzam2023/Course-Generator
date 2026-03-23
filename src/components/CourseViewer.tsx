import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { PlayCircle, CheckCircle, ChevronDown, ChevronUp, Menu, X, Users, Clock, Award, BookOpen } from 'lucide-react';
import Markdown from 'react-markdown';
import { generateLessonContent } from '../services/geminiService';

interface CourseViewerProps {
  course: Course;
  onBack: () => void;
}

export default function CourseViewer({ course, onBack }: CourseViewerProps) {
  const [activeModuleId, setActiveModuleId] = useState<string>(course.modules[0]?.id || '');
  const [activeLessonId, setActiveLessonId] = useState<string>(course.modules[0]?.lessons[0]?.id || '');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    [course.modules[0]?.id]: true
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [lessonContents, setLessonContents] = useState<Record<string, string>>({});
  const [generatingLessons, setGeneratingLessons] = useState<Record<string, boolean>>({});

  const activeModule = course.modules.find(m => m.id === activeModuleId);
  const activeLesson = activeModule?.lessons.find(l => l.id === activeLessonId);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleSelectLesson = (moduleId: string, lessonId: string) => {
    setActiveModuleId(moduleId);
    setActiveLessonId(lessonId);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (activeLesson && activeModule && !lessonContents[activeLesson.id] && !generatingLessons[activeLesson.id]) {
      const fetchContent = async () => {
        setGeneratingLessons(prev => ({ ...prev, [activeLesson.id]: true }));
        try {
          const content = await generateLessonContent(course.title, activeModule.title, activeLesson.title);
          setLessonContents(prev => ({ ...prev, [activeLesson.id]: content }));
        } catch (error) {
          console.error("Failed to generate lesson content", error);
          setLessonContents(prev => ({ ...prev, [activeLesson.id]: "Failed to load content. Please try again." }));
        } finally {
          setGeneratingLessons(prev => ({ ...prev, [activeLesson.id]: false }));
        }
      };
      fetchContent();
    }
  }, [activeLessonId, activeModuleId, course.title, activeLesson, activeModule, lessonContents, generatingLessons]);

  const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-4 lg:px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-md transition-colors lg:hidden"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="font-bold text-lg truncate max-w-[200px] sm:max-w-md lg:max-w-xl">
            {course.title}
          </div>
        </div>
        <button 
          onClick={onBack}
          className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          Exit Course
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <main className="flex-1 flex flex-col overflow-y-auto bg-slate-50">
          <div className="bg-slate-900 aspect-video w-full max-h-[60vh] flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />
            <PlayCircle className="w-20 h-20 text-white/80 group-hover:text-white group-hover:scale-110 transition-all cursor-pointer z-10" />
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <h2 className="text-2xl font-bold text-white mb-2">{activeLesson?.title}</h2>
              <p className="text-slate-300 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" /> {activeLesson?.duration}
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto w-full p-6 lg:p-10">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 min-h-[400px]">
              {generatingLessons[activeLessonId] ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                  <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                  <p className="font-medium animate-pulse">AI is writing this lesson...</p>
                </div>
              ) : (
                <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-a:text-indigo-600">
                  <Markdown>{lessonContents[activeLessonId] || "*Select a lesson to begin*"}</Markdown>
                </div>
              )}
            </div>

            <div className="mt-12">
              <h3 className="text-xl font-bold text-slate-900 mb-6">About this course</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-start gap-3">
                  <Award className="w-6 h-6 text-indigo-600 shrink-0" />
                  <div>
                    <div className="font-medium text-slate-900">Difficulty</div>
                    <div className="text-sm text-slate-500">{course.difficulty}</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-start gap-3">
                  <Users className="w-6 h-6 text-indigo-600 shrink-0" />
                  <div>
                    <div className="font-medium text-slate-900">Target Audience</div>
                    <div className="text-sm text-slate-500">{course.targetAudience}</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-start gap-3">
                  <Clock className="w-6 h-6 text-indigo-600 shrink-0" />
                  <div>
                    <div className="font-medium text-slate-900">Duration</div>
                    <div className="text-sm text-slate-500">{course.totalDuration}</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-start gap-3">
                  <BookOpen className="w-6 h-6 text-indigo-600 shrink-0" />
                  <div>
                    <div className="font-medium text-slate-900">Curriculum</div>
                    <div className="text-sm text-slate-500">{course.modules.length} modules • {totalLessons} lessons</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h4 className="font-bold text-lg mb-2">{course.subtitle}</h4>
                <p className="text-slate-600 leading-relaxed">{course.description}</p>
              </div>
            </div>
          </div>
        </main>

        <aside 
          className={`
            absolute lg:static inset-y-0 right-0 z-10
            w-80 bg-white border-l border-slate-200 flex flex-col
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="p-4 border-b border-slate-200 bg-slate-50 shrink-0">
            <h3 className="font-bold text-slate-900">Course Content</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {course.modules.map((module, index) => (
              <div key={module.id} className="border-b border-slate-200 last:border-b-0">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Section {index + 1}
                    </div>
                    <div className="font-medium text-slate-900 pr-4">{module.title}</div>
                  </div>
                  {expandedModules[module.id] ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                
                {expandedModules[module.id] && (
                  <div className="bg-white">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const isActive = activeLessonId === lesson.id;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleSelectLesson(module.id, lesson.id)}
                          className={`
                            w-full flex items-start gap-3 p-3 pl-4 text-left transition-colors
                            ${isActive ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}
                          `}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isActive ? (
                              <PlayCircle className="w-4 h-4 text-indigo-600" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-slate-300" />
                            )}
                          </div>
                          <div>
                            <div className={`text-sm ${isActive ? 'font-medium text-indigo-900' : 'text-slate-700'}`}>
                              {lessonIndex + 1}. {lesson.title}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                              <PlayCircle className="w-3 h-3" /> {lesson.duration}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
