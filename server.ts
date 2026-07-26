import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Gemini client initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// System Prompt for Socratic Economics Tutor
const SOCRATIC_SYSTEM_INSTRUCTION = `
[역할 및 페르소나]
당신은 대한민국 고등학교 1학년 통합사회(경제 영역) 학습을 돕는 친절하고 다정한 인공지능 경제 튜터 '알콩경제 동표쌤'입니다.
학생들이 '기회비용(Opportunity Cost)' 개념을 바탕으로 두 국가 간의 '적정 교역 조건(무역 비율/교역 범위)'을 스스로 도출할 수 있도록 소크라테스식(문답식)으로 안내하는 것이 핵심 목적입니다.

[대상 학생 및 지식 수준]
- 대상: 고등학교 1학년 학생
- 선수 지식: 기회비용(어떤 선택으로 포기해야 하는 다른 대안의 가치) 개념을 이미 기본적으로 이해하고 있음.
- 학습 목표: 두 국가의 생산비용(노동시간 등) 또는 최대 생산량 자료를 보고, 각 상품 1단위 생산의 기회비용을 계산한 뒤 비교우위 상품을 찾고, 양국 모두에게 이익이 되는 적정 무역 비율 범위(교역 조건)를 도출하는 것.

[소크라테스식 교수법 원칙 - 엄격히 준수할 것]
1. 절대 정답이나 최종 수식(범위)을 먼저 직접 알려주지 마세요.
2. 항상 학생의 이전 답변을 칭찬하거나 공감해준 뒤, 한 단계씩 스스로 생각하도록 유도하는 질문을 던지세요.
3. 학생이 계산 실수나 논리적 비약을 하면, 바로 틀렸다고 단정하지 말고 어느 부분에서 착오가 생겼는지 짚어주는 힌트 질문을 던지세요.
4. 설명은 명확하고 간결하며 다정하게 하세요. 고등학생 눈높이에 맞춰 상냥한 존댓말(해요체)을 사용하세요.
5. 학습 단계를 5단계로 나누어 단계별로 자연스럽게 유도하세요.

[5단계 가이드 로직]
- 1단계: 주어진 자료(생산비용 또는 최대 생산량)의 의미를 파악하고, 각 국가의 기준을 확인합니다.
- 2단계: 'A국에서 쌀 1단위를 더 만들려면 옷을 몇 단위 포기해야 할까?'처럼 1단위당 기회비용으로 변환해보도록 유도합니다.
- 3단계: 양국의 기회비용을 비교하여, 어느 국가가 어떤 상품에 '비교우위(기회비용이 더 작은 국가)'가 있는지 스스로 판단하게 합니다.
- 4단계: 교역 조건 범위를 설정합니다. (예: "A국은 쌀 1단위당 옷 1.5벌 이상의 대가를 받고 싶어 하고, B국은 쌀 1단위를 살 때 옷 2.5벌 이하로 지불하고 싶어 해요. 그렇다면 쌀 1단위와 옷의 교역 비율은 어디부터 어디 사이여야 할까요?")
- 5단계: 학생이 올바른 교역 조건 범위(예: 옷 1.5벌 < 쌀 1단위 < 옷 2.5벌)를 정확히 도출했을 때 크게 칭찬하고 성취감을 느끼게 마무리합니다!

[예외 및 가드레일]
- 경제/사회 탐구 이외의 질문이나 엉뚱한 말을 할 경우: "우와, 재밌는 질문이네요! 하지만 우리 지금은 경제의 '적정 무역비' 도출 미션을 완수해볼까요?"라며 친절하게 학습 문제로 되돌리세요.
- "답 알려줘" 또는 "그냥 공식 알려주세요"라고 할 때: "공식을 외우는 것보다 직접 원리를 깨우치는 게 수능과 내신에서 훨씬 강력해요! 쌤이랑 같이 한 걸음만 더 가볼까요?" 하고 힌트 질문을 던지세요.
`;

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", role: "Socratic Economics Tutor AI" });
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { history, userMessage, problemContext, currentStep } = req.body;

    // Prepare contents
    const contents: any[] = [];

    // System instruction enriched with problem context
    const fullSystemInstruction = `${SOCRATIC_SYSTEM_INSTRUCTION}

[현재 제시된 문제 상황]
- 문제 제목: ${problemContext?.title || "기본 무역 문제"}
- 국가: ${problemContext?.countryA || "A국"}, ${problemContext?.countryB || "B국"}
- 상품: ${problemContext?.goodX || "쌀"}, ${problemContext?.goodY || "옷"}
- 자료 유형: ${problemContext?.type === "cost" ? "생산비용 (1단위 생산에 필요한 노동시간 등 - 낮을수록 우수)" : "최대 생산량 (동일 자원으로 생산 가능한 양 - 높을수록 우수)"}
- 데이터:
  * ${problemContext?.countryA}: ${problemContext?.goodX} ${problemContext?.costA_X} / ${problemContext?.goodY} ${problemContext?.costA_Y}
  * ${problemContext?.countryB}: ${problemContext?.goodX} ${problemContext?.costB_X} / ${problemContext?.goodY} ${problemContext?.costB_Y}
  * 기회비용 정답 참고용 (학생에게 절대 유출 금지):
    - ${problemContext?.countryA} ${problemContext?.goodX} 1단위 기회비용 = ${problemContext?.goodY} ${problemContext?.oppA_X}
    - ${problemContext?.countryB} ${problemContext?.goodX} 1단위 기회비용 = ${problemContext?.goodY} ${problemContext?.oppB_X}
    - 적정 교역 조건 범위: ${problemContext?.minTrade} < ${problemContext?.goodX} 1단위 < ${problemContext?.maxTrade} (또는 그 반대 상품 기준)

[현재 진행 단계]: ${currentStep || 1}단계
`;

    // Map conversation history
    if (Array.isArray(history) && history.length > 0) {
      for (const msg of history) {
        contents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        });
      }
    }

    // Add latest user message
    contents.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction: fullSystemInstruction,
        temperature: 0.6,
      },
    });

    const responseText = response.text || "미안해요, 다시 한 번 말씀해 주시겠어요?";

    res.json({
      reply: responseText,
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    res.status(500).json({
      error: "AI 튜터 응답 중 오류가 발생했습니다.",
      details: error?.message,
    });
  }
});

// Evaluate endpoint (for instant scratchpad feedback / step assessment)
app.post("/api/evaluate", async (req, res) => {
  try {
    const { studentAnswer, problemContext, step } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `
학생이 아래 문제를 풀면서 ${step}단계에 대한 답변을 제출했습니다.

[문제 정보]
- 국가: ${problemContext.countryA}, ${problemContext.countryB}
- 상품: ${problemContext.goodX}, ${problemContext.goodY}
- 정답 정보:
  * ${problemContext.countryA} ${problemContext.goodX} 1단위 기회비용 = ${problemContext.goodY} ${problemContext.oppA_X}
  * ${problemContext.countryB} ${problemContext.goodX} 1단위 기회비용 = ${problemContext.goodY} ${problemContext.oppB_X}
  * ${problemContext.goodX} 비교우위 국가: ${problemContext.compAdvX}
  * ${problemContext.goodY} 비교우위 국가: ${problemContext.compAdvY}
  * 적정 교역 조건: ${problemContext.goodX} 1단위 = ${problemContext.goodY} ${problemContext.minTrade} ~ ${problemContext.maxTrade} 사이

[학생 답변]: "${studentAnswer}"

[요청]:
1. 학생의 답변이 맞았는지(isCorrect: true/false) 판단하세요.
2. 학생을 격려하는 짧은 피드백(feedbackText)을 한국어로 작성하세요.
3. 만약 틀렸다면 어떤 부분을 오해했는지 따뜻한 소크라테스식 힌트(hint)를 주세요.
4. 다음 추천 단계(nextSuggestedStep: 1~5)를 제시하세요.
`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrect: { type: Type.BOOLEAN },
            feedbackText: { type: Type.STRING },
            hint: { type: Type.STRING },
            nextSuggestedStep: { type: Type.INTEGER },
          },
          required: ["isCorrect", "feedbackText", "hint", "nextSuggestedStep"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Evaluate API Error:", error);
    res.status(500).json({ error: "계산 평가 중 오류가 발생했습니다." });
  }
});

// Generate Custom Economics Problem endpoint
app.post("/api/generate-problem", async (req, res) => {
  try {
    const { topic } = req.body;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `
대한민국 고등학교 1학년 통합사회(경제 영역) 시험이나 수행평가에 출제될 법한 두 국가 간의 비교우위 및 교역 조건 문제를 1개 생성해주세요.
주제 힌트: ${topic || "일상생활 흥미로운 주제 (예: K-POP 굿즈, 반도체, 커피와 도넛, 스마트폰 등)"}

문제 조건:
- 두 국가 이름 (예: 한국, 일본 / A국, B국 / 태양국, 달빛국 등)
- 두 상품 이름 (예: 반도체와 자동차 / 쌀과 옷 / K-Pop 앨범과 웹툰 등)
- 자료 유형: 'cost'(생산에 들어가는 노동시간/생산비용, 숫자가 작을수록 효율적) 또는 'amount'(동일 자원으로 만드는 최대 생산량, 숫자가 클수록 효율적)
- 깔끔하게 딱 떨어지는 분수/소수 수치 (예: 1단위당 2, 1.5, 3, 0.5 등 분수가 단순하게 나오는 값)

형식은 반드시 다음 JSON 구조여야 합니다:
{
  "id": "custom-1",
  "title": "문제 제목",
  "story": "문제에 대한 흥미로운 상황 설명 (1~2문장)",
  "countryA": "A국 이름",
  "countryB": "B국 이름",
  "goodX": "X상품 이름",
  "goodY": "Y상품 이름",
  "type": "cost" 또는 "amount",
  "unitLabel": "시간" 또는 "개",
  "costA_X": 숫자,
  "costA_Y": 숫자,
  "costB_X": 숫자,
  "costB_Y": 숫자,
  "oppA_X": A국 X상품 1단위의 Y상품 기회비용 (숫자),
  "oppA_Y": A국 Y상품 1단위의 X상품 기회비용 (숫자),
  "oppB_X": B국 X상품 1단위의 Y상품 기회비용 (숫자),
  "oppB_Y": B국 Y상품 1단위의 X상품 기회비용 (숫자),
  "compAdvX": X상품 비교우위 국가명,
  "compAdvY": Y상품 비교우위 국가명,
  "minTrade": 최소 교역 조건 (숫자, 더 적은 기회비용값),
  "maxTrade": 최대 교역 조건 (숫자, 더 큰 기회비용값),
  "tradeExplanation": "적정 교역 조건에 대한 한 줄 설명"
}
`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const problemData = JSON.parse(response.text || "{}");
    res.json(problemData);
  } catch (error: any) {
    console.error("Generate Problem API Error:", error);
    res.status(500).json({ error: "새 문제 생성 중 오류가 발생했습니다." });
  }
});

// Start Server & Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🎓 Socratic Economics Tutor Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
