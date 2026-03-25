
import { GoogleGenAI, Type } from "@google/genai";
import { MCQQuestion, CQQuestion, Subject, GradingResult, Language, ChatMessage, Question, EnglishQuestion } from "../types.ts";

const CORE_BOARD_INSTRUCTIONS = `
ROLE: Senior Board Question Setter. 
STRICT COMPLIANCE: NCTB SSC Board Pattern 2026.
FAST MODE: Generate concise, high-yield board questions (>80% probability).
STYLES: 
1. MCQ: Simple recall, multiple completion (i,ii,iii), and stem-based.
2. CQ: Four parts (ক, খ, গ, ঘ) based on board marking standard.
3. ENGLISH: Follow the specific board pattern with items like Fill in blanks, Substitution Table, Right form of verbs, Narrative style, Transformation, etc.
`;

const SUBJECT_PROMPTS = {
  [Subject.BANGLA_1ST]: "Focus: Core themes of Suva, Kopotakkho Nod, 1971, and Education vs Humanity. For CQs, ensure the solution/model answer is provided for each part.",
  [Subject.ENGLISH_1ST]: `ROLE: Expert SSC English 1st Paper Examiner. 
    STRICT SYLLABUS & PATTERN: 
    - Part A: Reading Test (50 Marks)
    1. Multiple Choice Questions (based on seen passage).
    2. Answering Questions (based on seen passage).
    3. Fill in the blanks without clues (based on seen passage).
    4. Information Transfer/Table completion (based on unseen passage).
    5. Summary writing (based on unseen passage).
    6. Matching (based on unseen passage).
    7. Rearranging.
    - Part B: Writing Test (50 Marks)
    8. Paragraph writing.
    9. Completing a story.
    10. Describing graph/chart.
    11. Informal letter/Email.
    12. Dialogue writing.
    IMPORTANT: For each item, provide a clear model answer/solution.`,
  [Subject.ENGLISH_2ND]: `ROLE: Expert SSC English 2nd Paper Examiner & Grammar Specialist.
    STRICT SYLLABUS & PATTERN:
    - Part A: Grammar (60 Marks)
    1. Gap filling activities with clues (Prepositions, Articles, Parts of speech).
    2. Gap filling activities without clues (Prepositions, Articles, Parts of speech).
    3. Substitution table.
    4. Right forms of verbs.
    5. Narrative style (Direct to Indirect).
    6. Changing sentences (Transformation).
    7. Completing sentences (using clauses/phrases).
    8. Use of suffixes and prefixes.
    9. Tag questions.
    10. Sentence connectors.
    11. Punctuation.
    - Part B: Composition (40 Marks)
    12. Writing CV with cover letter.
    13. Formal letter (Complaint letter/Notice/Purchase order).
    14. Paragraph writing.
    15. Composition writing.
    IMPORTANT: For each item, provide a clear model answer/solution.`,
  [Subject.MATH]: `ROLE: Expert SSC Mathematics Examiner & Question Setter. 
    STRICT SYLLABUS:
    - Algebra (ক বিভাগ): Ch 2 (Set & Function), Ch 3 (Algebraic Expressions), Ch 11 (Ratio & Proportion).
    - Geometry (খ বিভাগ): Ch 7 (Practical Geometry), Ch 8 (Circle).
    - Trigonometry & Mensuration (গ বিভাগ): Ch 9 (Trigonometric Ratio), Ch 16 (Mensuration).
    - Statistics (ঘ বিভাগ): Ch 17 (Statistics - Full).
    - IMPORTANT: For CQs, provide step-by-step solutions for each part (ক, খ, গ).`,
  [Subject.HISTORY]: "ROLE: Expert SSC History Examiner. Focus: World Civilizations (Ch 2), Ancient & Medieval Bengal (Ch 4, 6), British Rule & Resistance (Ch 8, 9), and 1970 Elections/Liberation War (Ch 13). For CQs, provide model answers for each part.",
  [Subject.CIVICS]: `ROLE: Expert SSC Civics and Citizenship Examiner. 
    STRICT SYLLABUS:
    - Ch 1: পৌরনীতি ও নাগরিকতা (Civics and Citizenship)
    - Ch 3: আইন, স্বাধীনতা ও সাম্য (Law, Liberty and Equality)
    - Ch 4: রাষ্ট্র ও সরকারব্যবস্থা (State and System of Government)
    - Ch 6: বাংলাদেশের সরকারব্যবস্থা (Government System in Bangladesh)
    - Ch 7: গণতন্ত্রে রাজনৈতিক দল ও নির্বাচন (Political Parties and Election in Democracy)
    - Ch 8: বাংলাদেশের স্থানীয় সরকারব্যবস্থা (Local Government System of Bangladesh)
    - For CQs, provide model answers for each part.`,
  [Subject.AGRICULTURE]: `ROLE: Expert SSC Agricultural Education Examiner. 
    STRICT SYLLABUS:
    - Ch 1: কৃষি প্রযুক্তি (Agricultural Technology)
    - Ch 2: কৃষি উপকরণ (Agricultural Materials)
    - Ch 4: কৃষিজ উৎপাদন (Agricultural Production)
    - Ch 5: বনায়ন (Forestry / Plantation)
    - For CQs, provide model answers for each part.`,
  [Subject.ICT]: `ROLE: Expert SSC ICT Examiner. 
    STRICT SYLLABUS:
    - Ch 1: কম্পিউটার ও তথ্য প্রযুক্তির পরিচিতি (Introduction to Computer & IT)
    - Ch 2: কম্পিউটার হার্ডওয়্যার ও সফটওয়্যার (Computer Hardware & Software)
    - Ch 3: office automation (Office Automation)
    - Ch 4: ইন্টারনেট ও যোগাযোগ প্রযুক্তি (Internet & Communication Technology)
    - Ch 6: প্রোগ্রামিং ও তথ্য প্রক্রিয়াকরণ (Programming & Data Processing)
    - For CQs, provide model answers for each part.`,
  [Subject.GEOGRAPHY]: `ROLE: Expert SSC Geography and Environment Examiner. 
    STRICT SYLLABUS:
    - Ch 1: ভূগোল ও পরিবেশ
    - Ch 2: মহাবিশ্ব ও আমাদের পৃথিবী
    - Ch 3: মানচিত্র পঠন ও ব্যবহার
    - Ch 4: পৃথিবীর অভ্যন্তরীণ ও বাহ্যিক গঠন
    - Ch 6: বারিমন্ডল
    - Ch 10: বাংলাদেশের ভৌগোলিক বিবরণ
    - Ch 14: বাংলাদেশের প্রাকৃতিক দুর্যোগ
    - For CQs, provide model answers for each part.`,
  [Subject.GENERAL_SCIENCE]: "Focus: Food & Nutrition (Ch 1), Blood & Heart (Ch 3), pH & Acids (Ch 4), Newton's Laws (Ch 5), and Circuits (Ch 11). For CQs, provide model answers for each part.",
};

const cleanJsonResponse = (text: string | undefined): string => {
  if (!text) return '[]';
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const geminiService = {
  async generateMCQs(subject: Subject, chapter: string, count: number, language: Language): Promise<MCQQuestion[]> {
    const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
    const isEnglishSubject = subject === Subject.ENGLISH_1ST || subject === Subject.ENGLISH_2ND;
    if (isEnglishSubject) return []; // English uses specialized board pattern instead of standard MCQs
    
    const effectiveLanguage = isEnglishSubject ? 'en' : language;
    const isFullSyllabus = chapter.toLowerCase().includes('full syllabus');
    const specificPersona = SUBJECT_PROMPTS[subject as keyof typeof SUBJECT_PROMPTS] || "";
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${CORE_BOARD_INSTRUCTIONS}
      Subject: ${subject}
      ${specificPersona}
      ${isFullSyllabus ? `Topic: Mixed chapters [${chapter}]. IMPORTANT: ONLY generate from the provided chapter list.` : `Topic: ${chapter}`}
      Task: Generate exactly ${count} Board-style MCQs in ${effectiveLanguage === 'bn' ? 'Bengali' : 'English'}.
      Return raw JSON only.`,
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
                  properties: { id: { type: Type.STRING }, text: { type: Type.STRING } },
                  required: ["id", "text"]
                }
              },
              correctOptionId: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["id", "type", "chapter", "question", "options", "correctOptionId", "explanation"]
          }
        }
      }
    });

    try {
      const cleanedText = cleanJsonResponse(response.text);
      const questions: MCQQuestion[] = JSON.parse(cleanedText);
      return questions.map(q => ({ ...q, type: 'MCQ' as const })).slice(0, count);
    } catch (e) {
      return [];
    }
  },

  async generateCQs(subject: Subject, chapter: string, count: number, language: Language): Promise<Question[]> {
    const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
    const isEnglishSubject = subject === Subject.ENGLISH_1ST || subject === Subject.ENGLISH_2ND;
    const effectiveLanguage = isEnglishSubject ? 'en' : language;
    const isFullSyllabus = chapter.toLowerCase().includes('full syllabus');
    const specificPersona = SUBJECT_PROMPTS[subject as keyof typeof SUBJECT_PROMPTS] || "";

    if (isEnglishSubject) {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${CORE_BOARD_INSTRUCTIONS}
        Subject: ${subject}
        ${specificPersona}
        Topic: ${chapter}
        Task: Generate exactly ${count} Board-style English Question sets. Each set should contain multiple items following the board pattern (e.g. Grammar items for 2nd paper, Reading items for 1st paper).
        Return raw JSON only.`,
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
                passage: { type: Type.STRING },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      instruction: { type: Type.STRING },
                      content: { type: Type.STRING },
                      marks: { type: Type.NUMBER },
                      type: { type: Type.STRING },
                      solution: { type: Type.STRING }
                    },
                    required: ["id", "instruction", "content", "marks", "type", "solution"]
                  }
                }
              },
              required: ["id", "type", "chapter", "items"]
            }
          }
        }
      });

      try {
        const cleanedText = cleanJsonResponse(response.text);
        const questions: EnglishQuestion[] = JSON.parse(cleanedText);
        return questions.map(q => ({ ...q, type: 'ENGLISH' as const })).slice(0, count);
      } catch (e) {
        return [];
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${CORE_BOARD_INSTRUCTIONS}
      Subject: ${subject}
      ${specificPersona}
      ${isFullSyllabus ? `Topic: Mixed concepts from [${chapter}]. IMPORTANT: ONLY generate from the provided chapter list.` : `Topic: ${chapter}`}
      Task: Generate exactly ${count} High-Quality Board CQs in ${effectiveLanguage === 'bn' ? 'Bengali' : 'English'}.
      Return raw JSON only.`,
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
              stem: { type: Type.STRING },
              parts: {
                type: Type.OBJECT,
                properties: {
                  a: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, marks: { type: Type.NUMBER }, label: { type: Type.STRING }, solution: { type: Type.STRING } }, required: ["question", "marks", "label", "solution"] },
                  b: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, marks: { type: Type.NUMBER }, label: { type: Type.STRING }, solution: { type: Type.STRING } }, required: ["question", "marks", "label", "solution"] },
                  c: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, marks: { type: Type.NUMBER }, label: { type: Type.STRING }, solution: { type: Type.STRING } }, required: ["question", "marks", "label", "solution"] },
                  d: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, marks: { type: Type.NUMBER }, label: { type: Type.STRING }, solution: { type: Type.STRING } }, required: ["question", "marks", "label", "solution"] }
                },
                required: ["a", "b", "c", "d"]
              }
            },
            required: ["id", "type", "chapter", "stem", "parts"]
          }
        }
      }
    });

    try {
      const cleanedText = cleanJsonResponse(response.text);
      const questions: CQQuestion[] = JSON.parse(cleanedText);
      return questions.map(q => ({ ...q, type: 'CQ' as const })).slice(0, count);
    } catch (e) {
      return [];
    }
  },

  async generateCQ(subject: Subject, chapter: string, language: Language): Promise<CQQuestion | null> {
    const questions = await this.generateCQs(subject, chapter, 1, language);
    return questions.length > 0 ? questions[0] : null;
  },

  async generateFullExam(subject: Subject, language: Language): Promise<{ mcqs: MCQQuestion[], cqs: Question[] }> {
    const isEnglishSubject = subject === Subject.ENGLISH_1ST || subject === Subject.ENGLISH_2ND;
    
    if (isEnglishSubject) {
      const [mcqResult, englishResult] = await Promise.all([
        this.generateMCQs(subject, "Final Board Pattern", 30, language),
        this.generateCQs(subject, "Full Board Standard Set", 1, language)
      ]);
      return { mcqs: mcqResult, cqs: englishResult };
    }

    const [mcqResult, cqResult] = await Promise.all([
      this.generateMCQs(subject, "Comprehensive Final Board Pattern", 30, language),
      this.generateCQs(subject, "Probable Board High Yield Set", 7, language)
    ]);
    return { mcqs: mcqResult, cqs: cqResult };
  },

  async gradeCQAnswer(question: CQQuestion | EnglishQuestion, answers: Record<string, { text: string, image?: string }>, language: Language): Promise<GradingResult> {
    const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
    const isEnglish = question.type === 'ENGLISH';
    const parts: any[] = [
      { text: `ROLE: Senior SSC Board Examiner & Subject Matter Expert.
        TASK: Grade the following ${isEnglish ? 'English board pattern' : 'Creative Question (CQ)'} strictly according to NCTB marking standards.
        LANGUAGE: Provide feedback in ${language === 'bn' ? 'Bengali' : 'English'}.
        
        MARKING CRITERIA:
        - For CQ: 
          Part A (Knowledge): 1 mark. Direct recall.
          Part B (Comprehension): 2 marks. Explanation.
          Part C (Application): 3 marks. Applying knowledge to stem.
          Part D (Higher Order): 4 marks. Analysis/Evaluation.
        - For English: Grade each item based on its assigned marks and grammar accuracy.
        
        GRADING PHILOSOPHY:
        - BE FAIR & CONSTRUCTIVE: If the student's answer is conceptually correct but has minor spelling or grammatical errors, give partial marks.
        - IMAGE ANALYSIS: If an image is provided, it's a photo of the student's handwritten answer. Analyze it carefully for content.
        - FEEDBACK: Be encouraging. Point out exactly what was missing for full marks. Use board-standard terminology.
        
        OUTPUT: Return a single JSON object with:
        - questionId: "${question.id}"
        - obtainedMarks: Total marks obtained (number)
        - maxMarks: Total possible marks (number)
        - feedback: Detailed breakdown of marks for each part (e.g., "ক: ১/১, খ: ১.৫/২...") and constructive feedback.
        - status: "Correct" (if full marks), "Partial" (if > 0 but < full), or "Incorrect" (if 0).` }
    ];
    
    if (isEnglish) {
      const eng = question as EnglishQuestion;
      eng.items.forEach(item => {
        parts.push({ text: `Item: ${item.instruction}\nContent: ${item.content}\nMarks: ${item.marks}\nModel Solution: ${item.solution}\nStudent Answer: ${answers[item.id]?.text || 'No answer provided.'}` });
      });
    } else {
      const cq = question as CQQuestion;
      (['a', 'b', 'c', 'd'] as const).forEach(p => {
        const qPart = cq.parts[p];
        if (qPart) {
          parts.push({ text: `Part ${p.toUpperCase()} (${qPart.marks} Marks): ${qPart.question}\nModel Solution: ${qPart.solution}\nStudent Answer: ${answers[p]?.text || 'No answer provided.'}` });
          if (answers[p]?.image) {
            parts.push({ 
              inlineData: { 
                data: answers[p].image.split(',')[1], 
                mimeType: "image/jpeg" 
              } 
            });
          }
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questionId: { type: Type.STRING },
            obtainedMarks: { type: Type.NUMBER },
            maxMarks: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
            status: { type: Type.STRING, enum: ["Correct", "Partial", "Incorrect"] }
          },
          required: ["questionId", "obtainedMarks", "maxMarks", "feedback", "status"]
        }
      }
    });

    try {
      const cleanedText = cleanJsonResponse(response.text);
      return JSON.parse(cleanedText);
    } catch (e) {
      return {
        questionId: question.id,
        obtainedMarks: 0,
        maxMarks: isEnglish ? (question as EnglishQuestion).items.reduce((acc, i) => acc + i.marks, 0) : 10,
        feedback: "Grading failed due to a technical error.",
        status: "Incorrect"
      };
    }
  }
};
