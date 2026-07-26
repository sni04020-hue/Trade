import React, { useState, useEffect } from 'react';
import { TradeProblem, ChatMessage, StudentScratchpadState } from './types';
import { PRESET_PROBLEMS } from './data/presetProblems';
import { Header } from './components/Header';
import { SocraticStepTracker } from './components/SocraticStepTracker';
import { ProblemCard } from './components/ProblemCard';
import { OpportunityCostScratchpad } from './components/OpportunityCostScratchpad';
import { TradeRangeVisualizer } from './components/TradeRangeVisualizer';
import { ChatTutor } from './components/ChatTutor';
import { CustomProblemModal } from './components/CustomProblemModal';
import { BadgeAchievementModal } from './components/BadgeAchievementModal';

export default function App() {
  const [problems, setProblems] = useState<TradeProblem[]>(PRESET_PROBLEMS);
  const [currentProblemId, setCurrentProblemId] = useState<string>(PRESET_PROBLEMS[0].id);

  // Current problem reference
  const activeProblem = problems.find((p) => p.id === currentProblemId) || problems[0];

  // Socratic Step State (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Scratchpad State
  const [scratchpad, setScratchpad] = useState<StudentScratchpadState>({
    oppA_XInput: '',
    oppA_YInput: '',
    oppB_XInput: '',
    oppB_YInput: '',
    userCompAdvX: '',
    userCompAdvY: '',
    minTradeInput: '',
    maxTradeInput: '',
  });

  // Chat Messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);

  // Step Evaluation
  const [evaluationResult, setEvaluationResult] = useState<{
    isCorrect?: boolean;
    feedbackText?: string;
    hint?: string;
  } | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Modals & Badges
  const [badgeCount, setBadgeCount] = useState<number>(0);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState<boolean>(false);

  // Initialize Chat when problem changes
  useEffect(() => {
    resetProblemState(activeProblem);
  }, [currentProblemId]);

  const resetProblemState = (problem: TradeProblem) => {
    setCurrentStep(1);
    setCompletedSteps([]);
    setEvaluationResult(null);
    setScratchpad({
      oppA_XInput: '',
      oppA_YInput: '',
      oppB_XInput: '',
      oppB_YInput: '',
      userCompAdvX: '',
      userCompAdvY: '',
      minTradeInput: '',
      maxTradeInput: '',
    });

    const isCost = problem.type === 'cost';

    const initialGreeting: ChatMessage = {
      id: 'init-1',
      role: 'assistant',
      content: `반가워요! 👋 고등학교 1학년 통합사회 경제 단원을 함께 공부할 **연정샘**이에요.

오늘 우리의 탐구 미션은 **'기회비용'** 개념을 바탕으로 **${problem.countryA}**와 **${problem.countryB}** 간의 **적정 교역 조건(무역 비율 범위)**을 스스로 도출하는 거랍니다!

연정샘이 공식을 그냥 외우게 하지 않고, 차근차근 질문을 던져서 스스로 깨우치도록 도울게요.

[1단계 질문]
먼저 제시된 표를 살펴볼까요? 
이 자료는 각 상품 1단위를 만드는 데 들어간 **'${isCost ? '노동시간(생산비용)' : '최대 생산량'}'** 자료입니다. 
숫자가 **${isCost ? '작을수록' : '크서 효율적인지'}**에 대해 알고 계신 점을 편하게 이야기해주세요!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([initialGreeting]);
  };

  // Handle sending user chat message to Gemini server
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoadingChat(true);

    try {
      // Send chat history and context to Express backend
      const historyForApi = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: historyForApi,
          userMessage: text,
          problemContext: activeProblem,
          currentStep,
        }),
      });

      if (!res.ok) throw new Error('AI 서버 응답에 실패했습니다.');

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: '미안해요! 서버와 통신 중 문제가 발생했어요. 다시 이야기해주시겠어요?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  // Check calculation in scratchpad
  const handleCheckAnswer = async (stepCheck: number) => {
    setIsEvaluating(true);
    setEvaluationResult(null);

    let studentAnswerText = '';
    if (stepCheck === 2) {
      studentAnswerText = `${activeProblem.countryA} ${activeProblem.goodX} 1단위 기회비용 = ${scratchpad.oppA_XInput}, ${activeProblem.goodY} 1단위 = ${scratchpad.oppA_YInput} / ${activeProblem.countryB} ${activeProblem.goodX} 1단위 = ${scratchpad.oppB_XInput}, ${activeProblem.goodY} 1단위 = ${scratchpad.oppB_YInput}`;
    } else if (stepCheck === 3) {
      studentAnswerText = `${activeProblem.goodX} 비교우위 = ${scratchpad.userCompAdvX}, ${activeProblem.goodY} 비교우위 = ${scratchpad.userCompAdvY}`;
    } else if (stepCheck === 4) {
      studentAnswerText = `적정 무역비 = ${scratchpad.minTradeInput} < ${activeProblem.goodX} 1단위 < ${scratchpad.maxTradeInput} (${activeProblem.goodY})`;
    }

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentAnswer: studentAnswerText,
          problemContext: activeProblem,
          step: stepCheck,
        }),
      });

      if (!res.ok) throw new Error('평가 실패');

      const evalData = await res.json();
      setEvaluationResult(evalData);

      if (evalData.isCorrect) {
        if (!completedSteps.includes(stepCheck)) {
          const nextCompleted = [...completedSteps, stepCheck];
          setCompletedSteps(nextCompleted);

          // Advance current step
          if (stepCheck < 5) {
            const nextStepNum = stepCheck + 1;
            setCurrentStep(nextStepNum);

            // Send celebration + next step prompt message from tutor
            handleSendMessage(
              `[${stepCheck}단계 완료 제출]: 정답입니다! ${stepCheck + 1}단계로 안내해주세요.`
            );
          } else {
            // Completed step 5
            setCompletedSteps([1, 2, 3, 4, 5]);
            setBadgeCount((prev) => prev + 1);
            setIsBadgeModalOpen(true);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setEvaluationResult({
        isCorrect: false,
        feedbackText: '채점 중 오류가 발생했습니다. 다시 시도해보세요.',
        hint: '수치가 올바르게 적혀 있는지 확인해보세요.',
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  // Auto fill correct values for quick practice testing
  const handleAutoFillCorrect = () => {
    setScratchpad({
      oppA_XInput: activeProblem.oppA_X.toString(),
      oppA_YInput: activeProblem.oppA_Y.toString(),
      oppB_XInput: activeProblem.oppB_X.toString(),
      oppB_YInput: activeProblem.oppB_Y.toString(),
      userCompAdvX: activeProblem.compAdvX,
      userCompAdvY: activeProblem.compAdvY,
      minTradeInput: activeProblem.minTrade.toString(),
      maxTradeInput: activeProblem.maxTrade.toString(),
    });

    setCompletedSteps([1, 2, 3, 4]);
    setCurrentStep(4);
  };

  // Add newly AI-generated problem
  const handleAddProblem = (newProb: TradeProblem) => {
    setProblems((prev) => [newProb, ...prev]);
    setCurrentProblemId(newProb.id);
  };

  // Go to next problem
  const handleNextProblem = () => {
    const currentIndex = problems.findIndex((p) => p.id === currentProblemId);
    const nextIndex = (currentIndex + 1) % problems.length;
    setCurrentProblemId(problems[nextIndex].id);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Header
        problems={problems}
        currentProblemId={currentProblemId}
        onSelectProblem={setCurrentProblemId}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
        onResetChat={() => resetProblemState(activeProblem)}
        badgeCount={badgeCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        {/* Socratic Roadmap Tracker */}
        <SocraticStepTracker
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={(step) => setCurrentStep(step)}
        />

        {/* 2-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Problem & Interactive Scratchpad & Visualizer) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Trade Problem Table & Scenario Card */}
            <ProblemCard
              problem={activeProblem}
              onSelectNewProblem={() => {
                const currentIndex = problems.findIndex((p) => p.id === currentProblemId);
                const nextIndex = (currentIndex + 1) % problems.length;
                setCurrentProblemId(problems[nextIndex].id);
              }}
              onOpenCustomModal={() => setIsCustomModalOpen(true)}
            />

            {/* Interactive Scratchpad & Calculation Checker */}
            <OpportunityCostScratchpad
              problem={activeProblem}
              scratchpad={scratchpad}
              setScratchpad={setScratchpad}
              onCheckAnswer={handleCheckAnswer}
              onAutoFillCorrect={handleAutoFillCorrect}
              evaluationResult={evaluationResult}
              isEvaluating={isEvaluating}
            />

            {/* Trade Range Graphic Visualizer */}
            <TradeRangeVisualizer problem={activeProblem} />
          </div>

          {/* Right Column (Socratic AI Tutor Chat Interface) */}
          <div className="lg:col-span-5 sticky top-20">
            <ChatTutor
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoadingChat}
              currentStep={currentStep}
              problem={activeProblem}
              onSelectStep={setCurrentStep}
            />
          </div>
        </div>
      </main>

      {/* Clean Utility Footer */}
      <footer className="h-12 bg-white border-t border-slate-200 px-8 flex items-center justify-between shrink-0 text-[11px] text-slate-400 uppercase font-semibold tracking-widest mt-8">
        <span>Economics High School Curriculum</span>
        <span>Interactive Learning Module v2.1</span>
        <span>Designed for South Korean Students</span>
      </footer>

      {/* Modals */}
      <CustomProblemModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddProblem={handleAddProblem}
      />

      <BadgeAchievementModal
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
        problem={activeProblem}
        onNextProblem={handleNextProblem}
      />
    </div>
  );
}

