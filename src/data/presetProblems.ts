import { TradeProblem } from '../types';

export const PRESET_PROBLEMS: TradeProblem[] = [
  {
    id: 'problem-1',
    title: '대표기출 ① 생산비 기준 (반도체 vs 자동차)',
    story: '한국과 일본이 각 상품 1단위를 생산하는 데 필요한 노동 시간(생산비용)입니다. 숫자가 작을수록 노동 시간이 적게 들어 생산 효율성이 높습니다.',
    countryA: '한국',
    countryB: '일본',
    goodX: '반도체',
    goodY: '자동차',
    type: 'cost',
    unitLabel: '시간',
    costA_X: 10,
    costA_Y: 20,
    costB_X: 15,
    costB_Y: 15,
    // 기회비용 계산 (생산비 기준: X 1단위 기회비용 = X생산시간 / Y생산시간)
    // 한국: 반도체 1단위 생산시간 10시간 -> 그동안 자동차 10/20 = 0.5대 포기
    // 한국: 자동차 1단위 생산시간 20시간 -> 그동안 반도체 20/10 = 2개 포기
    // 일본: 반도체 1단위 생산시간 15시간 -> 그동안 자동차 15/15 = 1대 포기
    // 일본: 자동차 1단위 생산시간 15시간 -> 그동안 반도체 15/15 = 1개 포기
    oppA_X: 0.5,
    oppA_Y: 2,
    oppB_X: 1,
    oppB_Y: 1,
    compAdvX: '한국',
    compAdvY: '일본',
    minTrade: 0.5,
    maxTrade: 1,
    tradeExplanation: '반도체 1개당 자동차 0.5대 ~ 1대 사이에서 교역이 이루어지면 양국 모두 이익을 얻습니다.',
    difficulty: '보통',
  },
  {
    id: 'problem-2',
    title: '대표기출 ② 최대 생산량 기준 (쌀 vs 옷)',
    story: 'A국과 B국이 주어진 동일한 자원(노동 100단위)으로 생산할 수 있는 최대 생산량입니다. 숫자가 클수록 자원 활용 효율성이 높습니다.',
    countryA: 'A국',
    countryB: 'B국',
    goodX: '쌀',
    goodY: '옷',
    type: 'amount',
    unitLabel: '가마 / 벌',
    costA_X: 20, // 쌀 20가마
    costA_Y: 40, // 옷 40벌
    costB_X: 10, // 쌀 10가마
    costB_Y: 30, // 옷 30벌
    // 기회비용 계산 (생산량 기준: X 1단위 기회비용 = Y최대생산량 / X최대생산량)
    // A국: 쌀 20가마 대신 옷 40벌 -> 쌀 1가마 = 옷 2벌
    // A국: 옷 40벌 대신 쌀 20가마 -> 옷 1벌 = 쌀 0.5가마
    // B국: 쌀 10가마 대신 옷 30벌 -> 쌀 1가마 = 옷 3벌
    // B국: 옷 30벌 대신 쌀 10가마 -> 옷 1벌 = 쌀 0.33가마
    oppA_X: 2,
    oppA_Y: 0.5,
    oppB_X: 3,
    oppB_Y: 0.33,
    compAdvX: 'A국',
    compAdvY: 'B국',
    minTrade: 2,
    maxTrade: 3,
    tradeExplanation: '쌀 1가마당 옷 2벌 ~ 3벌 사이에서 무역 비율이 결정되면 양국 모두 이득을 봅니다.',
    difficulty: '쉬움',
  },
  {
    id: 'problem-3',
    title: '실생활 사례 ③ K-콘텐츠 굿즈 (앨범 vs 웹툰)',
    story: 'K-POP 기획사와 웹툰 스튜디오가 굿즈 1상자를 제작하는 데 걸리는 작업 시간(시간)입니다.',
    countryA: 'K-POP 기획사',
    countryB: '웹툰 스튜디오',
    goodX: '포토카드 앨범',
    goodY: '캐릭터 인형',
    type: 'cost',
    unitLabel: '시간',
    costA_X: 4,
    costA_Y: 8,
    costB_X: 12,
    costB_Y: 12,
    // 기회비용 (생산비 기준)
    // A(K-POP): 앨범 1개 = 인형 4/8 = 0.5개
    // B(웹툰): 앨범 1개 = 인형 12/12 = 1개
    oppA_X: 0.5,
    oppA_Y: 2,
    oppB_X: 1,
    oppB_Y: 1,
    compAdvX: 'K-POP 기획사',
    compAdvY: '웹툰 스튜디오',
    minTrade: 0.5,
    maxTrade: 1,
    tradeExplanation: '앨범 1상자당 인형 0.5개 ~ 1개 범위에서 교역할 때 서로에게 기회비용 절감 이득이 생깁니다.',
    difficulty: '보통',
  },
  {
    id: 'problem-4',
    title: '도전 문제 ④ 카페 경제 (커피 vs 도넛 생산비)',
    story: '갑 카페와 을 카페가 메뉴 1단위를 만드는 데 필요한 노동 분(minute)입니다.',
    countryA: '갑 카페',
    countryB: '을 카페',
    goodX: '커피',
    goodY: '도넛',
    type: 'cost',
    unitLabel: '분',
    costA_X: 6,
    costA_Y: 18,
    costB_X: 8,
    costB_Y: 16,
    // 기회비용
    // 갑: 커피 1잔 = 도넛 6/18 = 0.33개
    // 을: 커피 1잔 = 도넛 8/16 = 0.5개
    oppA_X: 0.33,
    oppA_Y: 3,
    oppB_X: 0.5,
    oppB_Y: 2,
    compAdvX: '갑 카페',
    compAdvY: '을 카페',
    minTrade: 0.33,
    maxTrade: 0.5,
    tradeExplanation: '커피 1잔당 도넛 0.33개 ~ 0.5개 사이에서 무역 비율이 설정되면 양쪽 카페 모두 유익합니다.',
    difficulty: '도전',
  },
];
