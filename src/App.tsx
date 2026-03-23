/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import CourseForm from './components/CourseForm';
import CourseViewer from './components/CourseViewer';
import { Course } from './types';
import { generateCourseOutline } from './services/geminiService';
import { GraduationCap, Sparkles } from 'lucide-react';

export default function App() {
  const [course, setCourse] = useState<Course | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCourse = async (data: { topic: string; audience: string; difficulty: string; duration: string; additionalInfo: string }) => {
    setIsGenerating(true);
    setError(null);
    try {
      const generatedCourse = await generateCourseOutline(
        data.topic,
        data.audience,
        data.difficulty,
        data.duration,
        data.additionalInfo
      );
      setCourse(generatedCourse);
    } catch (err) {
      console.error(err);
      setError("Failed to generate course. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (course) {
    return <CourseViewer course={course} onBack={() => setCourse(null)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">AI CourseGen</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Powered by Gemini
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
            Turn any topic into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">professional course</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Enter your subject, target audience, and preferences. Our AI will instantly generate a structured curriculum, complete with modules, lessons, and detailed content.
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        <CourseForm onSubmit={handleGenerateCourse} isGenerating={isGenerating} />
      </main>
    </div>
  );
}
