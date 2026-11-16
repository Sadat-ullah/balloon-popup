import React from 'react';
import { LevelExplanation } from '../data/levels';
import { Sparkles, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ExplanationModalProps {
  question: string;
  answer: number;
  explanation: LevelExplanation;
  onContinue: () => void;
}

export const ExplanationModal: React.FC<ExplanationModalProps> = ({
  question,
  answer,
  explanation,
  onContinue,
}) => {
  const handleContinue = () => {
    sounds.playClick();
    onContinue();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-amber-300 text-center relative overflow-hidden transform animate-scale-up">
        {/* Top ribbon banner */}
        <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-extrabold px-4 py-1.5 rounded-full text-sm uppercase tracking-wider shadow-md -mt-2 mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Helpful Clue!</span>
        </div>

        {/* Question Heading */}
        <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl py-3 px-4 mb-4">
          <span className="text-2xl md:text-3xl font-black text-sky-800 tracking-wide font-game">
            {question.replace('?', '')} <span className="text-amber-500 font-black">{answer}</span>
          </span>
        </div>

        {/* Visual Dot Grouping Area */}
        <div className="bg-amber-50/70 border-2 border-dashed border-amber-200 rounded-2xl p-4 mb-4 min-h-[120px] flex flex-col items-center justify-center">
          {/* ADDITION DOTS */}
          {explanation.type === 'addition' && explanation.a !== undefined && explanation.b !== undefined && (
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {/* Group A */}
              <div className="flex flex-col items-center">
                <div className="flex gap-1.5 flex-wrap max-w-[120px] justify-center p-2 bg-blue-100 rounded-xl">
                  {Array.from({ length: Math.min(20, explanation.a) }).map((_, i) => (
                    <div key={i} className="w-4 h-4 rounded-full bg-blue-500 shadow-sm border border-white" />
                  ))}
                </div>
                <span className="text-xs font-bold text-blue-700 mt-1">{explanation.a} dots</span>
              </div>

              <span className="text-2xl font-black text-slate-400">+</span>

              {/* Group B */}
              <div className="flex flex-col items-center">
                <div className="flex gap-1.5 flex-wrap max-w-[120px] justify-center p-2 bg-pink-100 rounded-xl">
                  {Array.from({ length: Math.min(20, explanation.b) }).map((_, i) => (
                    <div key={i} className="w-4 h-4 rounded-full bg-pink-500 shadow-sm border border-white" />
                  ))}
                </div>
                <span className="text-xs font-bold text-pink-700 mt-1">{explanation.b} dots</span>
              </div>
            </div>
          )}

          {/* SUBTRACTION DOTS */}
          {explanation.type === 'subtraction' && explanation.a !== undefined && explanation.b !== undefined && (
            <div className="flex flex-col items-center">
              <div className="flex gap-1.5 flex-wrap max-w-[240px] justify-center p-2.5 bg-orange-50 rounded-xl border border-orange-200">
                {Array.from({ length: Math.min(25, explanation.a) }).map((_, i) => {
                  const isCrossed = i >= explanation.a! - explanation.b!;
                  return (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCrossed
                          ? 'bg-slate-300 text-slate-500 line-through opacity-50'
                          : 'bg-emerald-500 text-white'
                      }`}
                    >
                      {isCrossed ? '✕' : ''}
                    </div>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-orange-800 mt-1.5">
                {explanation.a} total dots - {explanation.b} taken away = {answer} left!
              </span>
            </div>
          )}

          {/* MULTIPLICATION GROUPS */}
          {explanation.type === 'multiplication' && explanation.a !== undefined && explanation.b !== undefined && (
            <div className="flex flex-col items-center">
              <div className="flex gap-2 flex-wrap justify-center max-w-[260px]">
                {Array.from({ length: Math.min(6, explanation.a) }).map((_, gIdx) => (
                  <div key={gIdx} className="bg-purple-100 border border-purple-300 rounded-lg p-1.5 flex gap-1 items-center">
                    {Array.from({ length: Math.min(6, explanation.b!) }).map((_, dIdx) => (
                      <div key={dIdx} className="w-3.5 h-3.5 rounded-full bg-purple-600" />
                    ))}
                  </div>
                ))}
              </div>
              <span className="text-xs font-bold text-purple-800 mt-2">
                {explanation.a} groups with {explanation.b} dots each = {answer} dots!
              </span>
            </div>
          )}

          {/* DIVISION GROUPS */}
          {explanation.type === 'division' && explanation.a !== undefined && explanation.b !== undefined && (
            <div className="flex flex-col items-center">
              <div className="flex gap-2 flex-wrap justify-center max-w-[260px]">
                {Array.from({ length: Math.min(6, explanation.b) }).map((_, gIdx) => (
                  <div key={gIdx} className="bg-teal-100 border border-teal-300 rounded-xl p-1.5 flex flex-col items-center">
                    <div className="flex gap-1 flex-wrap max-w-[60px] justify-center">
                      {Array.from({ length: Math.min(6, answer) }).map((_, dIdx) => (
                        <div key={dIdx} className="w-3 h-3 rounded-full bg-teal-600" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-teal-800 mt-0.5">{answer}</span>
                  </div>
                ))}
              </div>
              <span className="text-xs font-bold text-teal-800 mt-2">
                {explanation.a} divided into {explanation.b} baskets gives {answer} in each!
              </span>
            </div>
          )}

          {/* EXPRESSION / BODMAS */}
          {explanation.type === 'expression' && (
            <div className="p-2 text-center">
              <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-extrabold px-3 py-1 rounded-full mb-2">
                Order of Operations (BODMAS)
              </span>
              <p className="text-sm font-semibold text-slate-700 leading-snug">
                {explanation.text}
              </p>
            </div>
          )}
        </div>

        {/* Explanation Text Details */}
        {explanation.type !== 'expression' && (
          <p className="text-sm md:text-base font-bold text-slate-600 mb-6 px-2">
            {explanation.text}
          </p>
        )}

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white font-black text-lg py-3.5 px-6 rounded-2xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2 border-b-4 border-green-700"
        >
          <span>I Got It! Try Again</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
