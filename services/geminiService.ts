
import { GoogleGenAI, Type } from "@google/genai";
import { MCQQuestion, CQQuestion, Subject, GradingResult, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async generateMCQs(subject: Subject, chapter: string, count: number, language: Language): Promise<MCQQuestion[]> {
    const langPrompt = language === 'bn' ? "The questions and explanations must be in Bengali language (বাংলা ভাষা)." : "The questions and explanations must be in English language.";
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate ${count} board-style MCQ questions for Bangladesh SSC exam. 
      Subject: ${subject}
      Chapter: ${chapter}
      Strictly follow 2026 syllabus.
      ${langPrompt}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING },
              chapter: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING }
                  },
                  required: ["id", "text"]
                }
              },
              correctOptionId: { type: Type.STRING },
              explanation: { type: Type.STRING },
              difficulty: { type: Type.STRING }
            },
            required: ["id", "type", "chapter", "question", "options", "correctOptionId", "explanation"]
          }
        }
      }
    });

    try {
      return JSON.parse(response.text || '[]');
    } catch (e) {
      console.error("Failed to parse MCQs", e);
      return [];
    }
  },

  async generateCQ(subject: Subject, chapter: string, language: Language): Promise<CQQuestion | null> {
    const langPrompt = language === 'bn' ? "The stem, questions, and parts must be in Bengali language (বাংলা ভাষা)." : "The stem, questions, and parts must be in English language.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate one original SSC Creative Question (CQ) with a stem and 4 parts (a, b, c, d). 
      Subject: ${subject}
      Chapter: ${chapter}
      Follow 2026 NCTB pattern.
      ${langPrompt}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING },
            chapter: { type: Type.STRING },
            stem: { type: Type.STRING },
            parts: {
              type: Type.OBJECT,
              properties: {
                a: { 
                  type: Type.OBJECT, 
                  properties: { question: { type: Type.STRING }, marks: { type: Type.NUMBER }, label: { type: Type.STRING } },
                  required: ["question", "marks", "label"]
                },
                b: { 
                  type: Type.OBJECT, 
                  properties: { question: { type: Type.STRING }, marks: { type: Type.NUMBER }, label: { type: Type.STRING } },
                  required: ["question", "marks", "label"]
                },
                c: { 
                  type: Type.OBJECT, 
                  properties: { question: { type: Type.STRING }, marks: { type: Type.NUMBER }, label: { type: Type.STRING } },
                  required: ["question", "marks", "label"]
                },
                d: { 
                  type: Type.OBJECT, 
                  properties: { question: { type: Type.STRING }, marks: { type: Type.NUMBER }, label: { type: Type.STRING } },
                  required: ["question", "marks", "label"]
                }
              },
              required: ["a", "b", "c", "d"]
            }
          },
          required: ["id", "type", "chapter", "stem", "parts"]
        }
      }
    });

    try {
      return JSON.parse(response.text || 'null');
    } catch (e) {
      console.error("Failed to parse CQ", e);
      return null;
    }
  },

  async generateFullExam(subject: Subject, language: Language): Promise<{ mcqs: MCQQuestion[], cqs: CQQuestion[] }> {
    // We generate a board standard test: 15 MCQs and 2 CQs for the web demo (scaled down from 30/11 for performance)
    const mcqs = await this.generateMCQs(subject, "All Chapters (Full Syllabus)", 15, language);
    const cqs: CQQuestion[] = [];
    
    // Generate 2 CQs in parallel
    const cqPromises = [
      this.generateCQ(subject, "Selected Chapters", language),
      this.generateCQ(subject, "Selected Chapters", language)
    ];
    
    const resolvedCqs = await Promise.all(cqPromises);
    resolvedCqs.forEach(cq => { if(cq) cqs.push(cq); });

    return { mcqs, cqs };
  },

  async gradeCQAnswer(question: CQQuestion, answers: Record<string, { text: string, image?: string }>, language: Language): Promise<GradingResult[]> {
    const langPrompt = language === 'bn' ? "Provide feedback in Bengali (বাংলা ভাষা)." : "Provide feedback in English.";
    
    const parts: any[] = [
      { text: `Grade the student's answers for an SSC CQ based on Bangladesh marking scheme. 
      Each part (a, b, c, d) may contain text, a handwritten image, or both.
      Stem: ${question.stem}
      A: ${question.parts.a.question}
      B: ${question.parts.b.question}
      C: ${question.parts.c.question}
      D: ${question.parts.d.question}
      ${langPrompt}` }
    ];

    (['a', 'b', 'c', 'd'] as const).forEach(p => {
      const ans = answers[p] || { text: '' };
      parts.push({ text: `Student's Answer for Part ${p.toUpperCase()}: ${ans.text || '[See attached image if available]'}` });
      if (ans.image) {
        const base64Data = ans.image.split(',')[1];
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: 'image/jpeg'
          }
        });
      }
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              questionId: { type: Type.STRING },
              obtainedMarks: { type: Type.NUMBER },
              maxMarks: { type: Type.NUMBER },
              feedback: { type: Type.STRING },
              status: { type: Type.STRING }
            },
            required: ["questionId", "obtainedMarks", "maxMarks", "feedback", "status"]
          }
        }
      }
    });

    try {
      return JSON.parse(response.text || '[]');
    } catch (e) {
      console.error("Failed to parse grading", e);
      return [];
    }
  }
};
