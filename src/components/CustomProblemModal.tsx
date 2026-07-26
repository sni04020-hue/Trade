import React, { useState } from 'react';
import { TradeProblem } from '../types';
import { Sparkles, X, RefreshCw, Layers } from 'lucide-react';

interface CustomProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProblem: (problem: TradeProblem) => void;
}

export const CustomProblemModal: React.FC<CustomProblemModalProps> = ({
  isOpen,
  onClose,
  onAddProblem,
}) => {
  const [topicPrompt, setTopicPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/generate-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicPrompt }),
      });

      if (!res.ok) throw new Error('문제 생성에 실패했습니다.');

      const data = await res.json();
      onAddProblem(data);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || '문제 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-lg">AI 맞춤형 무역 문제 생성기</h3>
            <p className="text-xs text-slate-500">원하는 주제로 통합사회 교역 조건 문제를 만듭니다.</p>
          </div>
        </div>

        <div className="space-y-4 my-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              관심 있는 주제나 상품 키워드 입력 (선택)
            </label>
            <input
              type="text"
              value={topicPrompt}
              onChange={(e) => setTopicPrompt(e.target.value)}
              placeholder="예: K-POP 굿즈, 커피와 도넛, 반도체, 스마트폰 등"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-800">💡 생성 시 자동 포함되는 요소:</p>
            <p>• 생산비(시간) 또는 최대 생산량 기준 데이터</p>
            <p>• 기회비용 자동 계산 및 비교우위 판정 수치</p>
            <p>• 상호 이익 적정 교역 비율(무역비) 검증 데이터</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold">
              {errorMsg}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            AI 문제 생성하기
          </button>
        </div>
      </div>
    </div>
  );
};
