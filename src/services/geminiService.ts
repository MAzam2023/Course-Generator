import { GoogleGenAI, Type } from "@google/genai";
import { Course } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateCourseOutline(
  topic: string,
  audience: string,
  difficulty: string,
  duration: string,
  additionalInfo: string
): Promise<Course> {
  const prompt = `Create a comprehensive course outline for a course titled or about "${topic}".
Target Audience: ${audience}
Difficulty Level: ${difficulty}
Desired Course Duration: ${duration}
Additional Requirements: ${additionalInfo}

The course should be structured into modules, and each module should have multiple lessons.
Make it engaging and practical.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Catchy title of the course" },
          subtitle: { type: Type.STRING, description: "A short, compelling subtitle" },
          description: { type: Type.STRING, description: "Detailed description of what students will learn" },
          totalDuration: { type: Type.STRING, description: "Total estimated duration of the course, e.g., '4 hours'" },
          modules: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING, description: "Title of the module" },
                lessons: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING, description: "Title of the lesson" },
                      duration: { type: Type.STRING, description: "Estimated duration, e.g., '5 min'" }
                    },
                    required: ["id", "title", "duration"]
                  }
                }
              },
              required: ["id", "title", "lessons"]
            }
          }
        },
        required: ["title", "subtitle", "description", "totalDuration", "modules"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Failed to generate course outline");
  
  const courseData = JSON.parse(text);
  return {
    ...courseData,
    instructor: "AI Instructor",
    targetAudience: audience,
    difficulty: difficulty
  };
}

export async function generateLessonContent(
  courseTitle: string,
  moduleTitle: string,
  lessonTitle: string
): Promise<string> {
  const prompt = `You are an expert instructor teaching a course called "${courseTitle}".
Please write the detailed content for the lesson titled "${lessonTitle}" which is part of the module "${moduleTitle}".

Provide the content in Markdown format. 
Include:
- An engaging introduction
- Clear explanations of concepts
- Examples or code snippets if applicable
- A brief summary or key takeaways at the end

Do not include the lesson title as a heading (it will be displayed separately). Just provide the body content.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
  });

  return response.text || "Content could not be generated.";
}
