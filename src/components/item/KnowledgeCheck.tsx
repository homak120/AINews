import { useState } from 'react';
import { cn } from '../../utils/cn';
import { useKnowledgeChecks } from '../../hooks/useKnowledgeChecks';
import type { NewsItem } from '../../types';

interface KnowledgeCheckProps {
  item: NewsItem;
}

export function KnowledgeCheck({ item }: KnowledgeCheckProps) {
  const { getResult, saveResult, isCompleted } = useKnowledgeChecks();
  const existingResult = getResult(item.id);
  const completed = isCompleted(item.id);

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>(existingResult?.answers ?? []);

  const questions = item.knowledgeChecks;
  const question = questions[currentQ];
  if (!question) return null;

  const isLastQuestion = currentQ === questions.length - 1;
  const answered = selectedAnswer !== null;
  const isCorrect = answered && selectedAnswer === question.correctIndex;

  const handleSelect = (idx: number) => {
    if (answered || completed) return;
    setSelectedAnswer(idx);
  };

  const handleNext = () => {
    const nextAnswers = [...answers, selectedAnswer ?? 0];
    if (isLastQuestion) {
      saveResult(item.id, nextAnswers);
      setAnswers(nextAnswers);
    } else {
      setAnswers(nextAnswers);
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
    }
  };

  // Show completion summary when done
  if (completed && existingResult) {
    const correctCount = existingResult.answers.reduce((acc, ans, i) => {
      const q = questions[i];
      return acc + (q && ans === q.correctIndex ? 1 : 0);
    }, 0);

    return (
      <div className="
        relative overflow-hidden
        bg-white/[0.06] backdrop-blur-xl
        border border-white/[0.12] rounded-2xl p-6
        h-fit
        before:absolute before:top-0 before:inset-x-0 before:h-px
        before:bg-gradient-to-r before:from-transparent before:via-cyan-400/20 before:to-transparent
      ">
        <p className="text-[10px] font-mono font-semibold tracking-widest uppercase text-cyan-400 mb-4">
          Knowledge Check
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-slate-100 font-semibold text-sm">
              {correctCount}/{questions.length} correct
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              {new Date(existingResult.completedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {questions.map((q, i) => {
              const userAnswer = existingResult.answers[i];
              const correct = userAnswer === q.correctIndex;
              return (
                <div
                  key={i}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg border',
                    correct
                      ? 'bg-emerald-500/[0.06] border-emerald-500/20'
                      : 'bg-rose-500/[0.06] border-rose-500/20'
                  )}
                >
                  <span className={cn(
                    'flex-shrink-0 text-xs font-semibold',
                    correct ? 'text-emerald-400' : 'text-rose-400'
                  )}>
                    {correct ? '✓' : '✗'}
                  </span>
                  <span className="text-xs text-slate-400 line-clamp-1">
                    {q.question}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="
      relative overflow-hidden
      bg-white/[0.06] backdrop-blur-xl
      border border-white/[0.12] rounded-2xl p-6
      h-fit
      before:absolute before:top-0 before:inset-x-0 before:h-px
      before:bg-gradient-to-r before:from-transparent before:via-cyan-400/20 before:to-transparent
    ">
      <p className="text-[10px] font-mono font-semibold tracking-widest uppercase text-cyan-400 mb-4">
        Knowledge Check
      </p>

      <h3 className="text-[15px] font-semibold text-slate-100 leading-snug mb-5">
        {question.question}
      </h3>

      <div className="flex flex-col gap-2.5">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === idx;
          const correct = idx === question.correctIndex;

          let optionClass = 'bg-white/[0.05] border-white/[0.10] text-slate-300 hover:bg-white/[0.10] hover:border-white/[0.20]';
          if (answered) {
            if (correct) {
              optionClass = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400';
            } else if (isSelected && !correct) {
              optionClass = 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-shake';
            } else {
              optionClass = 'bg-white/[0.03] border-white/[0.06] text-slate-500';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={answered}
              className={cn(
                'w-full text-left p-4 rounded-xl text-sm border transition-all duration-150',
                optionClass
              )}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Explanation feedback */}
      {answered && (
        <div className={cn(
          'mt-4 p-4 rounded-xl border',
          isCorrect
            ? 'bg-emerald-500/[0.08] border-emerald-500/20'
            : 'bg-rose-500/[0.08] border-rose-500/20'
        )}>
          <p className={cn(
            'text-[11px] font-semibold uppercase tracking-[0.06em] mb-2',
            isCorrect ? 'text-emerald-400' : 'text-rose-400'
          )}>
            {isCorrect ? 'Correct!' : 'Not quite'}
          </p>
          <p className="text-xs text-slate-400 leading-[1.5]">{question.explanation}</p>
        </div>
      )}

      {/* Progress + next */}
      <div className="mt-5 pt-4 border-t border-white/[0.06]">
        <p className="text-xs text-slate-500 font-mono mb-3">
          {currentQ + 1} of {questions.length} questions
        </p>
        {answered && (
          <button
            onClick={handleNext}
            className="
              w-full py-3 rounded-xl text-sm text-cyan-400
              bg-cyan-500/10 border border-cyan-500/25
              hover:bg-cyan-500/15 transition-all duration-150
            "
          >
            {isLastQuestion ? 'Finish →' : 'Next question →'}
          </button>
        )}
      </div>
    </div>
  );
}
