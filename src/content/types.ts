/**
 * Typed schema for Chapters, Quizzes, Sections, and Code Blocks.
 * Follows Golden Rules G1-G7 and Chapter Template in §6.
 */

export type PipelineStage =
  | "overview"
  | "foundations"
  | "plan"
  | "semantic"
  | "acoustic"
  | "decode"
  | "wrapup";

export interface CodeBlock {
  title: string;
  code: string;
  language: "python" | "text" | "json";
  type: "runnable" | "needs-gpu";
  description?: string;
  output?: string;
  annotations?: Array<{
    line: number;
    text: string;
  }>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Section {
  heading: string;
  content: string; // Plain text / markdown with <term:id> markers or plain prose
  eli5Content?: string; // "Explain it simpler" pre-written version (§4.4)
  visualType?: "custom" | "diagram" | "card" | "compare";
}

export interface Chapter {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  pipelineStage: PipelineStage;
  estMinutes: number;
  hook: string;
  analogy: {
    title: string;
    body: string;
    breaksDown: string; // REQUIRED by G2: Where the analogy stops working
  };
  concept: Section[];
  inYuE2: {
    summary: string;
    factIds: string[]; // references facts.ts keys
  };
  pythonCorner: CodeBlock[];
  newTerms: string[]; // glossary keys introduced in this chapter
  recap: string[]; // 3-5 bullets
  quiz: [QuizQuestion, QuizQuestion, QuizQuestion]; // exactly 3 questions per chapter (G7)
}
