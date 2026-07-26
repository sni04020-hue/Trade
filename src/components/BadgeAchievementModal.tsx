import React from 'react';
import { Award, CheckCircle, Sparkles, X, ArrowRight } from 'lucide-react';
import { TradeProblem } from '../types';

interface BadgeAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  problem: TradeProblem;
  onNextProblem: () => void;
}

export const BadgeAchievementModal: React.FC<BadgeAchievementModalProps> = ({
  isOpen,
  onClose,
  problem,
  onNextProblem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 text-center shadow-2xl relative overflow-hidden">
        {/* Confetti Background Accent */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge Icon */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-4 border-amber-100 flex items-center justify-center text-4xl shadow-lg animate-bounce">
          🏆
        </div>

        <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-200 inline-block mb-2">
          축하합니다! 무역 마스터 뱃지 획득
        </span>

        <h3 className="text-xl font-black text-slate-900 mb-2">
          ‘교역 조건 도출 달인’ 달성!
        </h3>

        <p className="text-xs text-slate-600 mb-5 leading-relaxed">
          <strong className="text-emerald-700">{problem.title}</strong>의 5단계 소크라테스 탐구를 완료하여, 기회비용을 기반으로 상호 이익이 되는 적정 무역비를 스스로 계산해냈습니다!
        </p>

        {/* Problem Summary Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2 mb-6">
          <div className="font-bold text-slate-800 border-b border-slate-200 pb-1.5 flex items-center justify-between">
            <span>핵심 정리 리포트</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            • <strong>{problem.goodX} 비교우위:</strong> {problem.compAdvX} (낮은 기회비용)
          </div>
          <div>
            • <strong>{problem.goodY} 비교우위:</strong> {problem.compAdvY} (낮은 기회비용)
          </div>
          <div className="text-emerald-800 font-extrabold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
            • <strong>적정 교역 조건:</strong> {problem.goodX} 1단위 = {problem.goodY} {problem.minTrade} ~ {problem.maxTrade} 단위
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              onClose();
              onNextProblem();
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>다음 기출 문제 도전하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            현재 문제 다시 복습하기
          </button>
        </div>
      </div>
    </div>
  );
};
