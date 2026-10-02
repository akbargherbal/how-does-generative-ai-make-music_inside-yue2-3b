import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, XCircle, RotateCcw, Award } from "lucide-react";
import { QuizQuestion } from "../../content/types";

interface QuizProps {
  chapterId: number;
  questions: [QuizQuestion, QuizQuestion, QuizQuestion];
  onQuizComplete?: (score: number) => void;
}

export const Quiz: React.FC<QuizProps> = ({ chapterId, questions, onQuizComplete }) => {
  const storageKey = `yue2_quiz_ch_${chapterId}`;

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}_submitted`);
      return saved === "true";
    } catch {
      return false;
    }
  });

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => {
      const next = { ...prev, [questionIndex]: optionIndex };
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    localStorage.setItem(`${storageKey}_submitted`, "true");
    const score = calculateScore();
    if (score === 3) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // Safe if canvas unavailable
      }
    }
    onQuizComplete?.(score);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSelectedAnswers({});
    localStorage.removeItem(storageKey);
    localStorage.removeItem(`${storageKey}_submitted`);
  };

  const allAnswered = Object.keys(selectedAnswers).length === questions.length;
  const score = calculateScore();

  return (
    <section aria-label="Chapter Comprehension Check" className="my-10 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Chapter Check (3 Questions)
          </h3>
        </div>
        {isSubmitted && (
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Score: {score}/3 ({score === 3 ? "Perfect!" : "Keep practicing"})
          </span>
        )}
      </div>

      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const userAnswer = selectedAnswers[qIdx];
          const isAnswered = userAnswer !== undefined;
          const isCorrect = userAnswer === q.correctIndex;

          return (
            <div
              key={q.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs space-y-3"
            >
              <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
                <span className="font-mono text-cyan-600 dark:text-cyan-400 mr-1.5">{qIdx + 1}.</span>
                {q.question}
              </p>

              <div className="space-y-2 pt-1">
                {q.options.map((opt, optIdx) => {
                  const isSelected = userAnswer === optIdx;
                  let optionStyle =
                    "border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800";

                  if (isSubmitted) {
                    if (optIdx === q.correctIndex) {
                      optionStyle =
                        "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500";
                    } else if (isSelected && !isCorrect) {
                      optionStyle =
                        "border-rose-400 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200";
                    } else {
                      optionStyle = "opacity-50 border-slate-200 dark:border-slate-800";
                    }
                  } else if (isSelected) {
                    optionStyle =
                      "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/60 text-cyan-900 dark:text-cyan-100 ring-1 ring-cyan-500";
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelect(qIdx, optIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-start justify-between gap-3 ${optionStyle}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && optIdx === q.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {isSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Instant explanation */}
              {isSubmitted && (
                <div
                  className={`mt-3 p-3 rounded-xl text-xs leading-relaxed ${
                    isCorrect
                      ? "bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                      : "bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <span className="font-semibold block mb-0.5">
                    {isCorrect ? "Correct!" : "Explanation:"}
                  </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2">
        {!isSubmitted ? (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={handleSubmit}
            className={`px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all shadow-md ${
              allAnswered
                ? "bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer active:scale-95"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
            }`}
          >
            Check Answers
          </button>
        ) : (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </section>
  );
};
