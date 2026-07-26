import React, { useState } from 'react';
import { TradeProblem, StudentScratchpadState } from '../types';
import { Calculator, Check, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';

interface OpportunityCostScratchpadProps {
  problem: TradeProblem;
  scratchpad: StudentScratchpadState;
  setScratchpad: React.Dispatch<React.SetStateAction<StudentScratchpadState>>;
  onCheckAnswer: (step: number) => void;
  onAutoFillCorrect: () => void;
  evaluationResult: {
    isCorrect?: boolean;
    feedbackText?: string;
    hint?: string;
  } | null;
  isEvaluating: boolean;
}

export const OpportunityCostScratchpad: React.FC<OpportunityCostScratchpadProps> = ({
  problem,
  scratchpad,
  setScratchpad,
  onCheckAnswer,
  onAutoFillCorrect,
  evaluationResult,
  isEvaluating,
}) => {
  const [activeTab, setActiveTab] = useState<'step2' | 'step3' | 'step4'>('step2');

  const handleChange = (field: keyof StudentScratchpadState, value: string) => {
    setScratchpad((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">직접 계산 및 탐구 실습 노트</h3>
            <p className="text-xs text-slate-500">
              스스로 수치를 입력하고 채점 버튼을 눌러 정답과 피드백을 확인하세요.
            </p>
          </div>
        </div>

        <button
          onClick={onAutoFillCorrect}
          className="text-xs font-bold text-slate-500 hover:text-indigo-600 underline flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          정답 자동 연습 입력
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-5 gap-1">
        <button
          onClick={() => setActiveTab('step2')}
          className={`px-4 py-2.5 font-extrabold text-xs sm:text-sm border-b-2 cursor-pointer transition-colors ${
            activeTab === 'step2'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          2단계: 기회비용 계산
        </button>
        <button
          onClick={() => setActiveTab('step3')}
          className={`px-4 py-2.5 font-extrabold text-xs sm:text-sm border-b-2 cursor-pointer transition-colors ${
            activeTab === 'step3'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          3단계: 비교우위 판정
        </button>
        <button
          onClick={() => setActiveTab('step4')}
          className={`px-4 py-2.5 font-extrabold text-xs sm:text-sm border-b-2 cursor-pointer transition-colors ${
            activeTab === 'step4'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          4단계: 적정 무역비 범위
        </button>
      </div>

      {/* TAB 1: Step 2 - Opportunity Cost Calculation */}
      {activeTab === 'step2' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            📌 <strong>{problem.goodX} 1단위</strong>를 만들 때 포기하는 <strong>{problem.goodY}의 수량</strong>을 적어보세요.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Country A */}
            <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
              <span className="font-extrabold text-emerald-800 text-sm block mb-3 flex items-center gap-1.5">
                <span className="w-5 h-5 bg-emerald-200 rounded flex items-center justify-center text-xs">✓</span>
                {problem.countryA}의 기회비용
              </span>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {problem.goodX} 1단위 = {problem.goodY} 몇 단위?
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="any"
                      placeholder="예: 0.5"
                      value={scratchpad.oppA_XInput}
                      onChange={(e) => handleChange('oppA_XInput', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-xs font-bold text-slate-600 shrink-0">단위</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {problem.goodY} 1단위 = {problem.goodX} 몇 단위?
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="any"
                      placeholder="예: 2"
                      value={scratchpad.oppA_YInput}
                      onChange={(e) => handleChange('oppA_YInput', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-xs font-bold text-slate-600 shrink-0">단위</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Country B */}
            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
              <span className="font-extrabold text-indigo-900 text-sm block mb-3 flex items-center gap-1.5">
                <span className="w-5 h-5 bg-indigo-200 rounded flex items-center justify-center text-xs">✓</span>
                {problem.countryB}의 기회비용
              </span>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {problem.goodX} 1단위 = {problem.goodY} 몇 단위?
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="any"
                      placeholder="예: 1"
                      value={scratchpad.oppB_XInput}
                      onChange={(e) => handleChange('oppB_XInput', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-xs font-bold text-slate-600 shrink-0">단위</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {problem.goodY} 1단위 = {problem.goodX} 몇 단위?
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="any"
                      placeholder="예: 1"
                      value={scratchpad.oppB_YInput}
                      onChange={(e) => handleChange('oppB_YInput', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-xs font-bold text-slate-600 shrink-0">단위</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => onCheckAnswer(2)}
              disabled={isEvaluating}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isEvaluating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              2단계 기회비용 채점받기
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Step 3 - Comparative Advantage */}
      {activeTab === 'step3' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            📌 기회비용이 더 작은(낮은) 국가가 해당 상품에 <strong>비교우위</strong>가 있습니다. 각 상품별 비교우위 국가를 선택하세요.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
              <span className="font-extrabold text-indigo-900 text-sm block mb-2">
                1. {problem.goodX} 생산 비교우위 국가
              </span>
              <select
                value={scratchpad.userCompAdvX}
                onChange={(e) => handleChange('userCompAdvX', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">국가를 선택하세요</option>
                <option value={problem.countryA}>{problem.countryA}</option>
                <option value={problem.countryB}>{problem.countryB}</option>
              </select>
            </div>

            <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
              <span className="font-extrabold text-emerald-900 text-sm block mb-2">
                2. {problem.goodY} 생산 비교우위 국가
              </span>
              <select
                value={scratchpad.userCompAdvY}
                onChange={(e) => handleChange('userCompAdvY', e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">국가를 선택하세요</option>
                <option value={problem.countryA}>{problem.countryA}</option>
                <option value={problem.countryB}>{problem.countryB}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => onCheckAnswer(3)}
              disabled={isEvaluating}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isEvaluating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              3단계 비교우위 채점받기
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Step 4 - Trade Ratio Range */}
      {activeTab === 'step4' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            📌 양국 모두 상호 이익을 얻으려면, 교역 조건(무역 비율)은 <strong>양국의 기회비용 사이</strong>에 위치해야 합니다.
          </p>

          <div className="p-5 bg-indigo-50/40 border border-indigo-100 rounded-2xl">
            <label className="font-extrabold text-slate-800 text-sm block mb-3">
              {problem.goodX} 1단위와 교역할 {problem.goodY}의 적정 수량 범위
            </label>

            <div className="flex flex-wrap items-center gap-2.5">
              <input
                type="number"
                step="any"
                placeholder="최소값 (예: 0.5)"
                value={scratchpad.minTradeInput}
                onChange={(e) => handleChange('minTradeInput', e.target.value)}
                className="w-32 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="font-black text-slate-600">단위 &lt;</span>
              <span className="font-extrabold text-indigo-700 bg-indigo-100/80 border border-indigo-200 px-3.5 py-2 rounded-xl text-sm">
                {problem.goodX} 1단위
              </span>
              <span className="font-black text-slate-600">&lt;</span>
              <input
                type="number"
                step="any"
                placeholder="최대값 (예: 1.0)"
                value={scratchpad.maxTradeInput}
                onChange={(e) => handleChange('maxTradeInput', e.target.value)}
                className="w-32 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="font-black text-slate-600">단위 {problem.goodY}</span>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => onCheckAnswer(4)}
              disabled={isEvaluating}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isEvaluating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              4단계 무역비 범위 채점받기
            </button>
          </div>
        </div>
      )}

      {/* Evaluation Feedback Panel */}
      {evaluationResult && (
        <div
          className={`mt-5 p-4 rounded-2xl border transition-all ${
            evaluationResult.isCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <div className="flex items-start gap-3">
            {evaluationResult.isCorrect ? (
              <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-extrabold text-sm mb-1">
                {evaluationResult.isCorrect ? '🎉 정답입니다! 아주 잘 하셨어요.' : '🤔 다시 확인해볼까요?'}
              </div>
              <p className="text-xs leading-relaxed mb-1 font-medium">{evaluationResult.feedbackText}</p>
              {evaluationResult.hint && (
                <div className="mt-2 text-xs bg-white/90 p-3 rounded-xl border border-slate-200 font-medium text-slate-700">
                  💡 <strong>선생님의 힌트:</strong> {evaluationResult.hint}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

