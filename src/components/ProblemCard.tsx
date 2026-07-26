import React, { useState } from 'react';
import { TradeProblem } from '../types';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface ProblemCardProps {
  problem: TradeProblem;
  onSelectNewProblem: () => void;
  onOpenCustomModal: () => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  onSelectNewProblem,
  onOpenCustomModal,
}) => {
  const [showFormulaHint, setShowFormulaHint] = useState(false);

  const isCost = problem.type === 'cost';

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm mb-6">
      {/* Problem Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                problem.difficulty === '쉬움'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : problem.difficulty === '보통'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              난이도: {problem.difficulty}
            </span>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
              {isCost ? '⏱️ 생산비 기준 (노동시간)' : '📦 최대 생산량 기준'}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            {problem.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSelectNewProblem}
            className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            기출 문제 변경
          </button>
          <button
            onClick={onOpenCustomModal}
            className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            + AI 문제 생성
          </button>
        </div>
      </div>

      {/* Story Scenario */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-5 text-sm text-slate-700 leading-relaxed">
        <span className="font-extrabold text-slate-900 block mb-1">💡 문제 상황 안내</span>
        {problem.story}
      </div>

      {/* Main Data Table with Clean Utility Styling */}
      <div className="overflow-hidden border border-slate-200 rounded-2xl mb-5 shadow-xs">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-slate-800 text-white text-xs md:text-sm font-bold">
              <th className="p-3.5 text-left pl-4 font-black bg-slate-900">구분 / 상품</th>
              <th className="p-3.5 font-black border-l border-slate-700">
                {problem.goodX}{' '}
                <span className="text-[11px] font-normal text-slate-300">
                  (1단위당 {problem.unitLabel})
                </span>
              </th>
              <th className="p-3.5 font-black border-l border-slate-700">
                {problem.goodY}{' '}
                <span className="text-[11px] font-normal text-slate-300">
                  (1단위당 {problem.unitLabel})
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm md:text-base bg-white">
            <tr className="hover:bg-slate-50/80 transition-colors">
              <td className="p-4 font-black text-slate-800 text-left pl-4 bg-slate-50/60 border-r border-slate-200">
                {problem.countryA}
              </td>
              <td className="p-4 border-r border-slate-200">
                <span className="text-2xl md:text-3xl font-black text-slate-800">{problem.costA_X}</span>{' '}
                <small className="text-xs text-slate-500 font-normal">{problem.unitLabel}</small>
              </td>
              <td className="p-4">
                <span className="text-2xl md:text-3xl font-black text-slate-800">{problem.costA_Y}</span>{' '}
                <small className="text-xs text-slate-500 font-normal">{problem.unitLabel}</small>
              </td>
            </tr>
            <tr className="hover:bg-slate-50/80 transition-colors">
              <td className="p-4 font-black text-slate-800 text-left pl-4 bg-slate-50/60 border-r border-slate-200">
                {problem.countryB}
              </td>
              <td className="p-4 border-r border-slate-200 bg-indigo-50/30">
                <span className="text-2xl md:text-3xl font-black text-indigo-600">{problem.costB_X}</span>{' '}
                <small className="text-xs text-indigo-500 font-normal">{problem.unitLabel}</small>
              </td>
              <td className="p-4 bg-indigo-50/30">
                <span className="text-2xl md:text-3xl font-black text-indigo-600">{problem.costB_Y}</span>{' '}
                <small className="text-xs text-indigo-500 font-normal">{problem.unitLabel}</small>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Hint & Formula Toggle */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-900">
        <button
          onClick={() => setShowFormulaHint(!showFormulaHint)}
          className="flex items-center justify-between w-full font-bold text-amber-900 cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>
              {isCost
                ? '⏱️ [생산비 기준] 기회비용 계산 공식 및 가이드 보기'
                : '📦 [최대 생산량 기준] 기회비용 계산 공식 및 가이드 보기'}
            </span>
          </div>
          {showFormulaHint ? (
            <ChevronUp className="w-4 h-4 text-amber-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-amber-600" />
          )}
        </button>

        {showFormulaHint && (
          <div className="mt-3 pt-3 border-t border-amber-200/70 space-y-2 text-slate-700 leading-relaxed">
            {isCost ? (
              <>
                <p>
                  • <strong>생산비 기준 (노동시간 등)</strong>: 상품 1단위를 만드는 데 들어가는 <span className="text-rose-600 font-bold">비용이 적을수록</span> 우수합니다.
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-amber-200 font-mono text-[12px] text-slate-800">
                  📌 {problem.goodX} 1단위 기회비용 ={' '}
                  <span className="text-indigo-600 font-bold">
                    {problem.goodX} 생산시간 / {problem.goodY} 생산시간
                  </span>{' '}
                  ({problem.goodY}의 수량으로 표현)
                </div>
              </>
            ) : (
              <>
                <p>
                  • <strong>최대 생산량 기준</strong>: 동일한 자원으로 <span className="text-emerald-600 font-bold">더 많이 만들수록</span> 우수합니다.
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-amber-200 font-mono text-[12px] text-slate-800">
                  📌 {problem.goodX} 1단위 기회비용 ={' '}
                  <span className="text-emerald-600 font-bold">
                    {problem.goodY} 최대생산량 / {problem.goodX} 최대생산량
                  </span>{' '}
                  ({problem.goodY}의 수량으로 표현)
                </div>
              </>
            )}
            <p className="text-[11px] text-slate-500">
              💡 <strong>핵심 포인트:</strong> 기회비용 수치가 <strong className="text-emerald-700">더 적은 국가</strong>가 해당 상품 생산에 <strong className="text-emerald-700 font-bold">비교우위</strong>가 있습니다!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

