export type ProblemType = 'cost' | 'amount'; // cost = 생산비용(노동시간 등, 낮을수록 우수), amount = 최대생산량(높을수록 우수)

export interface TradeProblem {
  id: string;
  title: string;
  story: string;
  countryA: string;
  countryB: string;
  goodX: string;
  goodY: string;
  type: ProblemType;
  unitLabel: string; // "시간" or "개"
  costA_X: number;
  costA_Y: number;
  costB_X: number;
  costB_Y: number;
  oppA_X: number; // A국 X상품 1단위의 Y상품 기회비용
  oppA_Y: number; // A국 Y상품 1단위의 X상품 기회비용
  oppB_X: number; // B국 X상품 1단위의 Y상품 기회비용
  oppB_Y: number; // B국 Y상품 1단위의 X상품 기회비용
  compAdvX: string; // X상품 비교우위 국가명
  compAdvY: string; // Y상품 비교우위 국가명
  minTrade: number; // 최소 교역 비율 (낮은 기회비용)
  maxTrade: number; // 최대 교역 비율 (높은 기회비용)
  tradeExplanation: string;
  difficulty: '쉬움' | '보통' | '도전';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  stepHint?: number;
}

export interface StudentScratchpadState {
  oppA_XInput: string;
  oppA_YInput: string;
  oppB_XInput: string;
  oppB_YInput: string;
  userCompAdvX: string;
  userCompAdvY: string;
  minTradeInput: string;
  maxTradeInput: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
}
