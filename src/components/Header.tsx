import React from 'react';
import { BookOpen, Sparkles, Award, RotateCcw, Plus } from 'lucide-react';
import { TradeProblem } from '../types';

interface HeaderProps {
  problems: TradeProblem[];
  currentProblemId: string;
  onSelectProblem: (id: string) => void;
  onOpenCustomModal: () => void;
  onResetChat: () => void;
  badgeCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  problems,
  currentProblemId,
  onSelectProblem,
  onOpenCustomModal,
  onResetChat,
  badgeCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-xs">
            E
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-slate-800 tracking-tight">
                ECON MASTER <span className="text-indigo-600 font-black">AI TUTOR</span>
              </h1>
              <span className="text-[11px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full">
                고1 통합사회
              </span>
            </div>
            <p className="text-xs text-slate-500">
              소크라테스식 기회비용 탐구로 적정 교역조건 이끌어내기
            </p>
          </div>
        </div>

        {/* Control Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Problem Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <select
              value={currentProblemId}
              onChange={(e) => onSelectProblem(e.target.value)}
              className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer max-w-[200px] truncate"
            >
              {problems.map((p) => (
                <option key={p.id} value={p.id} className="bg-white text-slate-800">
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* AI Custom Problem Button */}
          <button
            onClick={onOpenCustomModal}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>AI 문제 생성</span>
          </button>

          {/* Reset Chat */}
          <button
            onClick={onResetChat}
            className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer border border-slate-200"
            title="대화 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">대화 리셋</span>
          </button>

          {/* Badge Count */}
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>뱃지 {badgeCount}개</span>
          </div>
        </div>
      </div>
    </header>
  );
};

