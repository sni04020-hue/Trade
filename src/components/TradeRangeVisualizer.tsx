import React, { useState } from 'react';
import { TradeProblem } from '../types';
import { Scale, CheckCircle } from 'lucide-react';

interface TradeRangeVisualizerProps {
  problem: TradeProblem;
}

export const TradeRangeVisualizer: React.FC<TradeRangeVisualizerProps> = ({ problem }) => {
  // Determine min and max opportunity cost values for good X in terms of good Y
  const oppA = problem.oppA_X;
  const oppB = problem.oppB_X;

  const minOpp = Math.min(oppA, oppB);
  const maxOpp = Math.max(oppA, oppB);

  // Exporters & Importers
  const exporterX = oppA < oppB ? problem.countryA : problem.countryB;
  const importerX = oppA < oppB ? problem.countryB : problem.countryA;

  // Slider value for proposed trade price
  const defaultPrice = (minOpp + maxOpp) / 2;
  const [tradePrice, setTradePrice] = useState<number>(defaultPrice);

  // Gains
  const exporterGain = (tradePrice - minOpp).toFixed(2);
  const importerGain = (maxOpp - tradePrice).toFixed(2);

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md mb-6 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">
              상호 이익 적정 교역 조건(무역 비율) 범위 시각화
            </h3>
            <p className="text-xs text-slate-400">
              {problem.goodX} 1단위와 교역할 {problem.goodY}의 수량을 슬라이더로 조절해 양국의 이득을 확인하세요.
            </p>
          </div>
        </div>

        <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold px-3 py-1 rounded-full self-start sm:self-auto">
          기회비용 범위 분석
        </span>
      </div>

      {/* Main Visualizer Bar */}
      <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700/80 mb-5">
        <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
          <span>
            {exporterX} 기회비용: <strong className="text-indigo-400">{minOpp}</strong> {problem.goodY}
          </span>
          <span className="text-emerald-400 font-extrabold">
            상호 이익 영역 ({minOpp} ~ {maxOpp})
          </span>
          <span>
            {importerX} 기회비용: <strong className="text-amber-400">{maxOpp}</strong> {problem.goodY}
          </span>
        </div>

        {/* Range Bar Graphic */}
        <div className="relative w-full h-9 bg-slate-950 rounded-xl overflow-hidden border border-slate-700 flex items-center my-3">
          {/* Below Min (Loss for Exporter) */}
          <div
            className="h-full bg-rose-950/70 border-r border-rose-800/50 flex items-center justify-center text-[10px] text-rose-400 font-bold"
            style={{ width: '25%' }}
          >
            {exporterX} 무역 거부
          </div>

          {/* Beneficial Zone */}
          <div
            className="h-full bg-indigo-600 flex items-center justify-center text-xs font-black text-white shadow-inner"
            style={{ width: '50%' }}
          >
            🤝 양국 상호 이익 발생! ({minOpp} ~ {maxOpp} {problem.goodY})
          </div>

          {/* Above Max (Loss for Importer) */}
          <div
            className="h-full bg-rose-950/70 border-l border-rose-800/50 flex items-center justify-center text-[10px] text-rose-400 font-bold"
            style={{ width: '25%' }}
          >
            {importerX} 무역 거부
          </div>
        </div>

        {/* Trade Price Slider */}
        <div className="mt-4 pt-3 border-t border-slate-700/80">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-200">
              현재 설정된 교역 비율:
            </label>
            <span className="text-sm font-black text-indigo-300 bg-slate-900 px-3 py-1 rounded-xl border border-indigo-500/30">
              {problem.goodX} 1단위 = {problem.goodY} <span className="text-emerald-400 text-base">{tradePrice}</span> 단위
            </span>
          </div>

          <input
            type="range"
            min={Math.max(0, minOpp - 1)}
            max={maxOpp + 1}
            step="0.05"
            value={tradePrice}
            onChange={(e) => setTradePrice(parseFloat(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
          />

          <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-mono">
            <span>{Math.max(0, minOpp - 1)}</span>
            <span>최소 {minOpp}</span>
            <span>중앙 {defaultPrice.toFixed(2)}</span>
            <span>최대 {maxOpp}</span>
            <span>{maxOpp + 1}</span>
          </div>
        </div>
      </div>

      {/* Trade Outcome Analysis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Exporter Gain */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            tradePrice < minOpp
              ? 'bg-rose-950/40 border-rose-700 text-rose-200'
              : 'bg-indigo-950/60 border-indigo-700/60 text-indigo-100'
          }`}
        >
          <div className="font-extrabold text-xs mb-1.5 flex items-center justify-between">
            <span>{exporterX} ({problem.goodX} 수출국)</span>
            {tradePrice >= minOpp ? (
              <span className="text-emerald-400 font-extrabold text-xs">
                +{exporterGain} 단위 이득!
              </span>
            ) : (
              <span className="text-rose-400 font-extrabold text-xs">손해 (교역 거부)</span>
            )}
          </div>
          <p className="text-[12px] opacity-80 leading-relaxed font-medium">
            자국 생산 기회비용({minOpp} {problem.goodY})보다 무역으로 받는 대가({tradePrice} {problem.goodY})가{' '}
            {tradePrice >= minOpp ? '더 많아 이익이 발생합니다.' : '적어서 무역에 응하지 않습니다.'}
          </p>
        </div>

        {/* Importer Gain */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            tradePrice > maxOpp
              ? 'bg-rose-950/40 border-rose-700 text-rose-200'
              : 'bg-emerald-950/60 border-emerald-700/60 text-emerald-100'
          }`}
        >
          <div className="font-extrabold text-xs mb-1.5 flex items-center justify-between">
            <span>{importerX} ({problem.goodX} 수입국)</span>
            {tradePrice <= maxOpp ? (
              <span className="text-emerald-400 font-extrabold text-xs">
                +{importerGain} 단위 이득!
              </span>
            ) : (
              <span className="text-rose-400 font-extrabold text-xs">손해 (교역 거부)</span>
            )}
          </div>
          <p className="text-[12px] opacity-80 leading-relaxed font-medium">
            자국 생산 기회비용({maxOpp} {problem.goodY})보다 무역 지불 비용({tradePrice} {problem.goodY})이{' '}
            {tradePrice <= maxOpp ? '더 저렴하여 이익이 발생합니다.' : '비싸서 무역에 응하지 않습니다.'}
          </p>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="mt-4 bg-slate-800/90 border border-slate-700 p-3.5 rounded-2xl flex items-center gap-3 text-xs text-slate-300">
        <CheckCircle className="w-5 h-5 text-indigo-400 shrink-0" />
        <div>
          <strong className="text-white font-bold">결론 핵심:</strong>{' '}
          교역 조건은 <span className="text-indigo-300 font-extrabold underline">{minOpp} &lt; 교역 비율 &lt; {maxOpp}</span> 범위 내에 있어야 양국 모두 자발적으로 무역에 참여합니다!
        </div>
      </div>
    </div>
  );
};

