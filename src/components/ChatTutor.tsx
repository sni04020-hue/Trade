import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, TradeProblem } from '../types';
import { Send, Volume2, VolumeX, Sparkles, User, Bot, RefreshCw } from 'lucide-react';

interface ChatTutorProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  currentStep: number;
  problem: TradeProblem;
  onSelectStep: (step: number) => void;
}

export const ChatTutor: React.FC<ChatTutorProps> = ({
  messages,
  onSendMessage,
  isLoading,
  currentStep,
  problem,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle Speech Readout for latest AI assistant message if enabled
  useEffect(() => {
    if (!isSpeechEnabled) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.role === 'assistant' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(lastMsg.content);
      utterance.lang = 'ko-KR';
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  }, [messages, isSpeechEnabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  // Quick preset Socratic prompt chips based on current step
  const getPromptChips = () => {
    switch (currentStep) {
      case 1:
        return [
          '생산비 기준과 생산량 기준의 차이가 뭔가요?',
          '표의 숫자 크기가 큰 게 좋은 건가요, 작은 게 좋은 건가요?',
          '1단계 관점에서 자료 해석 힌트 주세요!',
        ];
      case 2:
        return [
          '기회비용을 계산하는 공식이 헷갈려요.',
          `${problem.countryA}의 ${problem.goodX} 1단위 기회비용 구하는 방법 알려주세요!`,
          '기회비용의 단위는 무엇으로 적나요?',
        ];
      case 3:
        return [
          '기회비용이 더 큰 나라가 비교우위인가요, 작을 때 비교우위인가요?',
          '절대우위와 비교우위의 차이가 궁금해요!',
          `어느 나라가 ${problem.goodX}에 비교우위가 있는지 힌트 주세요.`,
        ];
      case 4:
        return [
          '왜 기회비용 사이에서 무역비(교역조건)가 형성되어야 하나요?',
          '교역 조건 범위를 적는 공식을 알려주세요!',
          '적정 교역 범위를 벗어나면 어떻게 되나요?',
        ];
      case 5:
        return [
          '무역을 하면 두 나라 모두 이득을 얻는 원리를 정리해주세요!',
          '시험 문제에 자주 나오는 오답 함정은 무엇인가요?',
          '다른 기출 문제도 풀어보고 싶어요!',
        ];
      default:
        return ['기회비용 질문있어요', '힌트 부탁해요'];
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col h-[620px] overflow-hidden">
      {/* Chat Header */}
      <div className="bg-white text-slate-800 p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-xl shrink-0">
            👩‍🏫
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-800">연정샘</h3>
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full">
                친절한 경제 도우미
              </span>
            </div>
            <p className="text-xs text-slate-500">
              소크라테스 대화법으로 함께 답을 찾아가는 AI 튜터
            </p>
          </div>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={() => {
            if (isSpeechEnabled && 'speechSynthesis' in window) {
              window.speechSynthesis.cancel();
            }
            setIsSpeechEnabled(!isSpeechEnabled);
          }}
          className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
            isSpeechEnabled
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
          title={isSpeechEnabled ? '음성 읽기 켜짐' : '음성 읽기 끔'}
        >
          {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline">{isSpeechEnabled ? '음성 ON' : '음성 OFF'}</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-extrabold text-xs border ${
                  isUser
                    ? 'bg-slate-800 text-white border-slate-700'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-200 shadow-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-emerald-700" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] sm:max-w-[78%]`}>
                <div
                  className={`p-4 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-xs font-medium'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                  }`}
                >
                  {msg.content}
                </div>
                <div
                  className={`text-[11px] text-slate-400 mt-1 px-1 font-medium ${
                    isUser ? 'text-right' : 'text-left'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-xs flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
              <span className="text-xs font-bold text-slate-600">
                연정샘이 질문을 가다듬고 생각하는 중...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Socratic Chips */}
      <div className="bg-white border-t border-slate-100 px-4 py-2.5 overflow-x-auto">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold whitespace-nowrap mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>{currentStep}단계 추천 질문:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {getPromptChips().map((chipText, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(chipText);
              }}
              className="text-xs bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-700 border border-slate-200 rounded-xl px-3 py-1.5 font-medium transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              {chipText}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="연정샘에게 내 답이나 질문을 이야기해보세요..."
          className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-40 cursor-pointer shrink-0 shadow-xs flex items-center gap-1.5"
        >
          <span>확인</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

