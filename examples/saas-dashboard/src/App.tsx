import {
  createAdaptiveEngine,
  createLocalStorageAdapter
} from '@adaptive-ui/core';
import {
  applyAdaptiveIntentRecommendation,
  createHeuristicAdaptiveIntentCompiler,
  type AdaptiveIntentRecommendation
} from '@adaptive-ui/llm';
import {
  AdaptiveProvider,
  AdaptiveSlot,
  AdaptiveSurface,
  useAdaptiveActions,
  useAdaptiveDevtools,
  useAdaptivePlan,
  useAdaptivePreference
} from '@adaptive-ui/react';
import {
  AdaptiveDevtoolsOverlay,
  type AdaptiveDevtoolsLabels
} from '@adaptive-ui/devtools';
import { componentRegistry } from './components';
import { dashboardHomeSurface } from './dashboardSchema';
import { useState } from 'react';

const engine = createAdaptiveEngine({
  storage: createLocalStorageAdapter('adaptive-ui.example.dashboard'),
  learnedPersistenceThrottleMs: 1_000,
  surfaces: [dashboardHomeSurface]
});

const intentCompiler = createHeuristicAdaptiveIntentCompiler();

const themeOptions = [
  { value: 'system', label: '시스템' },
  { value: 'light', label: '라이트' },
  { value: 'dark', label: '다크' }
] as const;

const densityOptions = [
  { value: 'auto', label: '자동' },
  { value: 'compact', label: '압축' },
  { value: 'comfortable', label: '여유' }
] as const;

const navOptions = [
  { value: 'auto', label: '자동' },
  { value: 'sidebar', label: '사이드바' },
  { value: 'tabs', label: '탭' },
  { value: 'bottom', label: '하단' },
  { value: 'command', label: '명령 중심' }
] as const;

const labelMap = {
  theme: Object.fromEntries(
    themeOptions.map((item) => [item.value, item.label])
  ),
  density: Object.fromEntries(
    densityOptions.map((item) => [item.value, item.label])
  ),
  navMode: Object.fromEntries(
    navOptions.map((item) => [item.value, item.label])
  ),
  layoutBias: {
    focus: '집중',
    overview: '개요',
    compare: '비교'
  },
  contentMode: {
    summary: '요약',
    detailed: '상세',
    progressive: '점진적 공개'
  },
  transitionMode: {
    none: '없음',
    css: 'CSS 전환',
    'view-transition': 'View Transition'
  }
} as const;

const demoCards = [
  {
    title: '이 데모가 보여주는 것',
    items: [
      '같은 대시보드가 사용자 유형에 따라 밀도, 정보량, 탐색 구조, 기본 보기, 보조 패널 우선순위가 달라집니다.',
      '사용자가 직접 고른 테마, 밀도, 탐색 방식은 자동 추정보다 항상 우선합니다.',
      '행동 신호가 쌓이면 차트 우선 보기, 명령 중심 탐색, 보조 패널 접힘 같은 변화가 보수적으로 반영됩니다.',
      '모든 변화는 왜 이렇게 선택되었는지 devtools와 plan 요약에서 설명할 수 있어야 합니다.'
    ]
  },
  {
    title: 'LLM은 어디에 연결되나',
    items: [
      'LLM은 런타임에서 DOM을 직접 만들지 않습니다.',
      'LLM은 세그먼트 설명, 운영자용 추천, 초기 프로필 초안, 실험 아이디어 같은 control plane 역할에 연결됩니다.',
      '실제 렌더 시점에는 저장된 선호, 시스템 설정, 브라우저 컨텍스트, 규칙 기반 엔진만 사용합니다.',
      '즉, LLM은 추천 계층이고 이 라이브러리는 안전하게 실행하는 personalization runtime입니다.'
    ]
  },
  {
    title: '추천 시연 순서',
    items: [
      '먼저 초보 관리자, 숙련 분석가, 모바일 빠른 확인 시뮬레이션을 눌러 같은 화면이 어떻게 달라지는지 보여줍니다.',
      '그 다음 테마, 밀도, 탐색을 직접 바꿔서 explicit override가 즉시 반영되는지 보여줍니다.',
      '표 정렬, 차트 비교, 패널 접기 버튼을 눌러 행동 신호가 쌓이면 무엇이 바뀌는지 확인합니다.',
      '마지막으로 devtools에서 why trace, 점수 분해, freeze, simulation을 열어 설명 가능성을 보여줍니다.'
    ]
  }
] as const;

const sampleIntentPrompts = [
  '차트를 먼저 보고 키보드로 빠르게 이동하고 싶어요.',
  '처음 쓰는 관리자라서 요약과 가이드가 먼저 보였으면 좋겠어요.',
  '모바일에서 승인만 빨리 처리할 수 있게 간단한 화면으로 보여주세요.'
] as const;

const devtoolsLabels: Partial<AdaptiveDevtoolsLabels> = {
  ariaLabel: 'Adaptive UI 개발 도구',
  title: 'Adaptive UI 개발 도구',
  noSurfaceMounted: '마운트된 surface 없음',
  hide: '숨기기',
  pin: '고정',
  profile: '프로필',
  density: '밀도',
  theme: '테마',
  nav: '탐색',
  expertise: '전문성',
  learnedDenseUi: '학습된 고밀도 선호',
  learnedCharts: '학습된 차트 선호',
  learnedKeyboardFlow: '학습된 키보드 흐름 선호',
  learnedStableLayout: '학습된 안정 레이아웃 선호',
  controls: '제어',
  freezeCurrentPlan: '현재 계획 고정',
  unfreeze: '고정 해제',
  resetDefaults: '기본값으로 초기화',
  clearSimulation: '시뮬레이션 해제',
  simulateNovice: '초보 사용자 시뮬레이션',
  simulateExpert: '전문가 시뮬레이션',
  simulateMobile: '모바일 시뮬레이션',
  highContrast: '고대비',
  reducedMotion: '모션 감소',
  simulation: '현재 시뮬레이션',
  simulationNames: {
    novice: '초보 관리자',
    expert: '숙련 분석가',
    mobile: '모바일 빠른 확인',
    'high-contrast': '고대비',
    'reduced-motion': '모션 감소'
  },
  plan: '계획',
  layoutMode: '레이아웃 모드',
  disclosure: '정보 노출',
  transition: '전환',
  confidence: '신뢰도',
  cooldownZones: '쿨다운 적용 영역',
  none: '없음',
  noPlanYet: '아직 계산된 계획이 없습니다.',
  zones: '영역별 선택',
  score: '점수',
  whyTrace: '이유 추적',
  exposureLog: '노출 로그'
};

function PreferenceSelect<TValue extends string>({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: TValue;
  onChange: (value: TValue) => void;
  options: ReadonlyArray<{ value: TValue; label: string }>;
}) {
  return (
    <label className="control">
      <span>{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value as TValue)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function DemoGuide() {
  return (
    <section className="guide-grid" aria-label="데모 안내">
      {demoCards.map((card) => (
        <article className="guide-card" key={card.title}>
          <div className="eyebrow">데모 가이드</div>
          <h2>{card.title}</h2>
          <ul className="guide-list">
            {card.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}

function IntentStudio() {
  const actions = useAdaptiveActions();
  const devtools = useAdaptiveDevtools();
  const plan = useAdaptivePlan('dashboard.home');
  const [request, setRequest] = useState<string>(sampleIntentPrompts[0]);
  const [isApplying, setIsApplying] = useState(false);
  const [lastRecommendation, setLastRecommendation] =
    useState<AdaptiveIntentRecommendation | null>(null);
  const [lastAppliedSummary, setLastAppliedSummary] = useState<string>('');

  async function applyIntent(userRequest: string) {
    setIsApplying(true);
    try {
      const recommendation = await intentCompiler.compile({
        surface: dashboardHomeSurface,
        userRequest,
        userProfile: devtools.profile,
        context: devtools.context,
        currentPlan: plan,
        language: 'ko-KR'
      });

      const applied = applyAdaptiveIntentRecommendation(recommendation, {
        currentContext: devtools.context,
        updateExplicitPreference: actions.updateExplicitPreference,
        patchContext: actions.patchContext
      });

      const appliedParts = [
        applied.updatedPreferences.length > 0
          ? `명시적 설정 ${applied.updatedPreferences.join(', ')}`
          : null,
        applied.patchedContext ? '컨텍스트 패치 적용' : null,
        Object.keys(applied.variantHints).length > 0
          ? `variant 힌트 ${Object.keys(applied.variantHints).length}개`
          : null
      ].filter(Boolean);

      setLastAppliedSummary(
        appliedParts.length > 0
          ? `${recommendation.messageToUser} 적용 내용: ${appliedParts.join(', ')}.`
          : recommendation.messageToUser
      );
      setLastRecommendation(recommendation);
    } finally {
      setIsApplying(false);
    }
  }

  async function handlePreset(prompt: string) {
    setRequest(prompt);
    await applyIntent(prompt);
  }

  return (
    <section className="topbar-card intent-studio">
      <div className="intent-header">
        <div>
          <div className="eyebrow">의도 기반 화면 요청</div>
          <h2>원하는 화면을 한 문장으로 바로 요청해보세요</h2>
        </div>
        <span className="inline-pill">로컬 휴리스틱 컴파일러</span>
      </div>
      <p className="lede">
        현재 예제는 네트워크 없이 동작하는 로컬 intent compiler를 사용합니다.
        실제 제품에서는 이 위치에 <code>@adaptive-ui/llm/openai</code> 같은
        서버측 adapter를 연결해서 사용자 의도를 안전한 recommendation으로
        변환하면 됩니다.
      </p>
      <form
        className="intent-form"
        onSubmit={(event) => {
          event.preventDefault();
          void applyIntent(request);
        }}
      >
        <label className="intent-label" htmlFor="intent-request">
          원하는 화면 요청
        </label>
        <textarea
          id="intent-request"
          className="intent-textarea"
          value={request}
          placeholder="예: 차트를 먼저 보고 키보드로 빠르게 이동하고 싶어요."
          onChange={(event) => setRequest(event.target.value)}
        />
        <div className="scenario-row">
          <button
            className="primary-button"
            type="submit"
            disabled={isApplying}
          >
            {isApplying ? '적용 중...' : '요청 적용'}
          </button>
          {sampleIntentPrompts.map((prompt) => (
            <button
              key={prompt}
              className="secondary-button"
              type="button"
              onClick={() => void handlePreset(prompt)}
            >
              샘플 적용
            </button>
          ))}
        </div>
      </form>
      {lastRecommendation ? (
        <div className="intent-result">
          <div className="summary-row">
            <div>
              <div className="eyebrow">최근 recommendation</div>
              <strong>{lastRecommendation.summary}</strong>
            </div>
            <div>
              <div className="eyebrow">추천 신뢰도</div>
              <strong>{lastRecommendation.confidence.toFixed(2)}</strong>
            </div>
          </div>
          <p className="lede">{lastAppliedSummary}</p>
          <div className="chip-row">
            {Object.entries(lastRecommendation.preferenceUpdates).map(
              ([key, value]) => (
                <span className="inline-pill" key={`${key}-${String(value)}`}>
                  {key}:{' '}
                  {Array.isArray(value) ? value.join(', ') : String(value)}
                </span>
              )
            )}
            {Object.entries(lastRecommendation.variantHints).map(
              ([zoneName, variantId]) => (
                <span className="inline-pill" key={`${zoneName}-${variantId}`}>
                  {zoneName}: {variantId}
                </span>
              )
            )}
          </div>
          <div className="why-card">
            {lastRecommendation.reasoning.map((line) => (
              <div key={line}>{line}</div>
            ))}
            {lastRecommendation.unsupportedRequests.map((line) => (
              <div key={line}>제약으로 제외됨: {line}</div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ControlBar() {
  const theme = useAdaptivePreference('theme');
  const density = useAdaptivePreference('density');
  const navMode = useAdaptivePreference('navMode');
  const actions = useAdaptiveActions();

  return (
    <section className="topbar-card">
      <div>
        <div className="eyebrow">제약된 적응 런타임</div>
        <h1>사용자별로 안전하게 달라지는 운영 대시보드</h1>
        <p className="lede">
          이 예제는 LLM이 화면을 직접 생성하지 않고, 승인된 슬롯과 변형 안에서
          사용자별 계획을 계산해 화면을 조합하는 방식을 보여줍니다. 접근성,
          명시적 설정, 안정성 가드는 항상 자동 최적화보다 우선합니다.
        </p>
      </div>
      <div className="control-grid">
        <PreferenceSelect
          label="테마"
          value={theme.value}
          onChange={theme.setValue}
          options={themeOptions}
        />
        <PreferenceSelect
          label="밀도"
          value={density.value}
          onChange={density.setValue}
          options={densityOptions}
        />
        <PreferenceSelect
          label="탐색"
          value={navMode.value}
          onChange={navMode.setValue}
          options={navOptions}
        />
      </div>
      <div className="scenario-row">
        <button
          className="scenario-button"
          type="button"
          onClick={() => actions.simulateScenario('novice')}
        >
          초보 관리자
        </button>
        <button
          className="scenario-button"
          type="button"
          onClick={() => actions.simulateScenario('expert')}
        >
          숙련 분석가
        </button>
        <button
          className="scenario-button"
          type="button"
          onClick={() => actions.simulateScenario('mobile')}
        >
          모바일 빠른 확인
        </button>
        <button
          className="scenario-button"
          type="button"
          onClick={() => actions.clearSimulation()}
        >
          시뮬레이션 해제
        </button>
      </div>
    </section>
  );
}

function PlanSummary() {
  const plan = useAdaptivePlan('dashboard.home');
  const actions = useAdaptiveActions();

  if (!plan) {
    return null;
  }

  const resolved = plan.resolvedPreferences.values;
  const planHighlights = [
    `현재 탐색 구조는 ${labelMap.navMode[resolved.navMode]} 기준으로 선택되었습니다.`,
    `정보 노출은 ${labelMap.contentMode[plan.disclosureLevel]}, 레이아웃 편향은 ${labelMap.layoutBias[plan.layoutMode]} 중심입니다.`,
    '접근성 제약, 명시적 설정, 안정성 가드가 자동 개인화보다 앞선 우선순위를 가집니다.'
  ];

  return (
    <section className="topbar-card summary-card">
      <div className="summary-row">
        <div>
          <div className="eyebrow">현재 계획</div>
          <strong>{labelMap.layoutBias[plan.layoutMode]}</strong> 레이아웃 ·{' '}
          {labelMap.contentMode[plan.disclosureLevel]} 정보 노출 ·{' '}
          {labelMap.transitionMode[plan.transitionMode]} 전환
        </div>
        <div>
          <div className="eyebrow">신뢰도</div>
          <strong>{plan.confidence.toFixed(2)}</strong>
        </div>
      </div>
      <div className="chip-row">
        {plan.exposureIds.map((exposureId) => (
          <span className="inline-pill" key={exposureId}>
            {exposureId}
          </span>
        ))}
      </div>
      <div className="why-card">
        {planHighlights.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
      <div className="scenario-row">
        <button
          className="secondary-button"
          type="button"
          onClick={() => actions.simulateScenario('high-contrast')}
        >
          고대비 시뮬레이션
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={() => actions.simulateScenario('reduced-motion')}
        >
          모션 감소 시뮬레이션
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={() => actions.resetPreferences()}
        >
          기본값으로 초기화
        </button>
      </div>
    </section>
  );
}

function DashboardCanvas() {
  const plan = useAdaptivePlan('dashboard.home');
  const theme = plan?.resolvedPreferences.values.theme ?? 'light';

  return (
    <div className="app-shell" data-theme={theme}>
      <ControlBar />
      <DemoGuide />
      <IntentStudio />
      <PlanSummary />
      <AdaptiveSurface
        surface="dashboard.home"
        schema={dashboardHomeSurface}
        components={componentRegistry}
        className="dashboard-surface"
      >
        <div className="dashboard-grid">
          <div className="grid-primary-nav">
            <AdaptiveSlot name="primaryNav" />
          </div>
          <div className="grid-hero">
            <AdaptiveSlot name="hero" />
          </div>
          <div className="grid-summary">
            <AdaptiveSlot name="summaryPanel" />
          </div>
          <div className="grid-main">
            <AdaptiveSlot name="mainContent" />
          </div>
          <div className="grid-side">
            <AdaptiveSlot name="sidePanel" />
          </div>
          <div className="grid-actions">
            <AdaptiveSlot name="quickActions" />
          </div>
        </div>
      </AdaptiveSurface>
      <AdaptiveDevtoolsOverlay
        surfaceId="dashboard.home"
        labels={devtoolsLabels}
      />
    </div>
  );
}

export default function App() {
  return (
    <AdaptiveProvider
      engine={engine}
      initialContext={{
        surfaceId: 'dashboard.home',
        route: '/dashboard',
        locale: 'ko-KR',
        timezone: 'Asia/Seoul',
        viewport: {
          width: 1280,
          height: 900
        }
      }}
      surfaces={[dashboardHomeSurface]}
    >
      <DashboardCanvas />
    </AdaptiveProvider>
  );
}
