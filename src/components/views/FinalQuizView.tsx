import React, { useState } from "react";
import confetti from "canvas-confetti";
import { FINAL_QUIZ_QUESTIONS } from "../../content/finalQuiz";
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowRight } from "lucide-react";

interface FinalQuizViewProps {
  onSelectChapter: (chapterId: number) => void;
}

export const FinalQuizView: React.FC<FinalQuizViewProps> = ({ onSelectChapter }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    FINAL_QUIZ_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    if (score >= 8) {
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // canvas fallback
      }
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSelectedAnswers({});
  };

  const score = calculateScore();
  const allAnswered = Object.keys(selectedAnswers).length === FINAL_QUIZ_QUESTIONS.length;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Comprehensive Final Exam
          </h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          10 questions testing your overall understanding of how YuE2-3B turns text lyrics into 48 kHz stereo music. Instant explanations provided for every option.
        </p>
      </div>

      {/* Score Banner when submitted */}
      {isSubmitted && (
        <div
          className={`p-6 rounded-2xl border text-center space-y-2 ${
            score >= 8
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
              : "bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200"
          }`}
        >
          <h2 className="text-xl font-bold">
            {score === 10
              ? "Flawless Score: 10/10! Master of Music AI Architecture!"
              : score >= 8
              ? `Great job! You passed with ${score}/10!`
              : `You scored ${score}/10. Review the chapters and try again!`}
          </h2>
          <p className="text-xs max-w-md mx-auto opacity-90">
            {score >= 8
              ? "You now have a solid, rigorous conceptual understanding of tokens, embeddings, attention, autoregression, flow matching, and VAE decoding."
              : "Don't worry—generative music AI is complex! Look over the question explanations below to see where you can brush up."}
          </p>
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-6">
        {FINAL_QUIZ_QUESTIONS.map((q, qIdx) => {
          const userAnswer = selectedAnswers[qIdx];
          const isCorrect = userAnswer === q.correctIndex;

          return (
            <div
              key={q.id}
              className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4"
            >
              <p className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                <span className="font-mono text-cyan-600 dark:text-cyan-400 mr-2">{qIdx + 1}.</span>
                {q.question}
              </p>

              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = userAnswer === optIdx;
                  let optionStyle =
                    "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800";

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
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start justify-between gap-3 ${optionStyle}`}
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

              {/* Explanation */}
              {isSubmitted && (
                <div
                  className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                    isCorrect
                      ? "bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                      : "bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <span className="font-bold block mb-1">
                    {isCorrect ? "Correct!" : "Explanation:"}
                  </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        {!isSubmitted ? (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={handleSubmit}
            className={`px-6 py-3 rounded-xl font-medium text-sm shadow-md transition-all ${
              allAnswered
                ? "bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer active:scale-95"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
            }`}
          >
            Submit Final Exam ({Object.keys(selectedAnswers).length}/10 answered)
          </button>
        ) : (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Final Exam</span>
          </button>
        )}
      </div>
    </div>
  );
};
