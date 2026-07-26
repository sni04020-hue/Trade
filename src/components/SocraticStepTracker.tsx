import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SocraticStepTrackerProps {
  currentStep: number; // 1 to 5
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

export const STEPS_INFO = [
  {
    step: 1,
    title: '1. 자료 구분',
    subtitle: '생산비 vs 생산량',
  },
  {
    step: 2,
    title: '2. 기회비용 계산',
    subtitle: '1단위당 포기한 양',
  },
  {
    step: 3,
    title: '3. 비교우위 판정',
    subtitle: '상대적 우위 상품',
  },
  {
    step: 4,
    title: '4. 교역조건 설정',
    subtitle: '적정 무역비 범위',
  },
  {
    step: 5,
    title: '5. 미션 완수',
    subtitle: '상호 교역 이득',
  },
];

export const SocraticStepTracker: React.FC<SocraticStepTrackerProps> = ({
  currentStep,
  completedSteps,
  onStepClick,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100">
            소크라테스 5단계 탐구
          </span>
          <h2 className="text-sm md:text-base font-extrabold text-slate-800 tracking-tight">
            단계별 적정 교역 조건 도출 로드맵
          </h2>
        </div>
        <div className="text-xs font-semibold text-slate-500">
          학습 진도: <span className="text-indigo-600 font-extrabold">{completedSteps.length} / 5</span> 완료 ({Math.round((completedSteps.length / 5) * 100)}%)
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 mb-5 overflow-hidden">
        <div
          className="bg-indigo-600 h-2 transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / 5) * 100}%` }}
        ></div>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {STEPS_INFO.map((item) => {
          const isCurrent = currentStep === item.step;
          const isCompleted = completedSteps.includes(item.step);

          return (
            <button
              key={item.step}
              onClick={() => onStepClick(item.step)}
              className={`relative flex flex-col text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                isCurrent
                  ? 'bg-indigo-50/60 border-indigo-400 ring-2 ring-indigo-500/20 shadow-xs'
                  : isCompleted
                  ? 'bg-emerald-50/40 border-emerald-200 hover:bg-emerald-50/80'
                  : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                    isCurrent
                      ? 'bg-indigo-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  STEP {item.step}
                </span>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : isCurrent ? (
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                ) : null}
              </div>

              <div className="font-bold text-xs md:text-sm text-slate-800 line-clamp-1">
                {item.title}
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                {item.subtitle}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

