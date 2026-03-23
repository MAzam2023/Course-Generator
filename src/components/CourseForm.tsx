import React, { useState } from 'react';
import { BookOpen, Target, Zap, Info, Loader2, Clock } from 'lucide-react';

interface CourseFormProps {
  onSubmit: (data: { topic: string; audience: string; difficulty: string; duration: string; additionalInfo: string }) => void;
  isGenerating: boolean;
}

export default function CourseForm({ onSubmit, isGenerating }: CourseFormProps) {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [difficultyState, setDifficultyState] = useState('Beginner');
  const [duration, setDuration] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ topic, audience, difficulty: difficultyState, duration, additionalInfo });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create a New Course</h2>
        <p className="text-slate-500 mt-2">Let AI design a comprehensive curriculum for you.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            Course Topic
          </label>
          <input
            type="text"
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Advanced React Patterns, Introduction to Astrophysics"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-500" />
            Target Audience
          </label>
          <input
            type="text"
            required
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="e.g., Frontend Developers, High School Students"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-500" />
            Difficulty Level
          </label>
          <select
            value={difficultyState}
            onChange={(e) => setDifficultyState(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            Course Duration
          </label>
          <input
            type="text"
            required
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g., 2 hours, 4 weeks, 10 lessons"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-500" />
            Additional Requirements (Optional)
          </label>
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Any specific topics to cover, tone of voice, etc."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isGenerating || !topic || !audience || !duration}
          className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Curriculum...
            </>
          ) : (
            'Generate Course'
          )}
        </button>
      </form>
    </div>
  );
}
