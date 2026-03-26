import type { SurfaceSchema } from '@adaptive-ui/core';
import type {
  AdaptiveIntentCompiler,
  AdaptiveIntentInput,
  AdaptiveIntentRecommendation
} from './types';
import { normalizeAdaptiveIntentRecommendation } from './validate';

function includesAny(input: string, keywords: string[]) {
  return keywords.some((keyword) => input.includes(keyword));
}

function prefersKorean(input: AdaptiveIntentInput) {
  return (
    input.language?.toLowerCase().startsWith('ko') ||
    /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(input.userRequest)
  );
}

function localize(
  useKorean: boolean,
  messages: { en: string; ko: string }
): string {
  return useKorean ? messages.ko : messages.en;
}

function createHeuristicPayload<TSurface extends SurfaceSchema>(
  input: AdaptiveIntentInput<TSurface>
) {
  const useKorean = prefersKorean(input);
  const normalized = input.userRequest.toLowerCase();
  const preference_updates: Record<string, unknown> = {};
  const context_patch: Record<string, unknown> = {};
  const variant_hints: Record<string, string> = {};
  const reasoning: string[] = [];
  const suggested_prompts: string[] = [];

  if (includesAny(normalized, ['차트', '그래프', 'chart', 'visualize'])) {
    preference_updates.defaultView = 'chart';
    preference_updates.contentMode = 'detailed';
    preference_updates.layoutBias = 'compare';
    variant_hints.mainContent = 'chartPowerView';
    reasoning.push(
      localize(useKorean, {
        en: 'The request emphasized charts or visual comparison.',
        ko: '요청에서 차트 중심 확인과 시각 비교가 중요하게 드러났습니다.'
      })
    );
  }

  if (includesAny(normalized, ['표', '테이블', 'table', 'list'])) {
    preference_updates.defaultView = 'table';
    variant_hints.mainContent = 'tablePowerView';
    reasoning.push(
      localize(useKorean, {
        en: 'The request explicitly asked for a table-first surface.',
        ko: '요청에서 표 중심 화면을 명확하게 원했습니다.'
      })
    );
  }

  if (includesAny(normalized, ['카드', 'card', 'summary cards'])) {
    preference_updates.defaultView = 'cards';
    preference_updates.contentMode = 'summary';
    variant_hints.mainContent = 'cardPowerView';
    reasoning.push(
      localize(useKorean, {
        en: 'The request favored a card-based summary view.',
        ko: '요청에서 카드 기반 요약 구성을 선호했습니다.'
      })
    );
  }

  if (includesAny(normalized, ['초보', '처음', '쉽게', '가이드', 'novice'])) {
    preference_updates.expertise = 'novice';
    preference_updates.density = 'comfortable';
    preference_updates.contentMode = 'progressive';
    preference_updates.layoutBias = 'overview';
    variant_hints.hero = 'noviceHero';
    variant_hints.summaryPanel = 'progressiveSummary';
    variant_hints.sidePanel = 'onboardingRail';
    variant_hints.quickActions = 'prominentActions';
    reasoning.push(
      localize(useKorean, {
        en: 'The request sounded like a beginner-friendly workflow.',
        ko: '요청이 초보 사용자를 위한 가이드 중심 흐름에 가깝습니다.'
      })
    );
  }

  if (
    includesAny(normalized, [
      '숙련',
      '전문가',
      '분석',
      'expert',
      'analyst',
      'power'
    ])
  ) {
    preference_updates.expertise = 'expert';
    preference_updates.density = 'compact';
    preference_updates.contentMode = 'detailed';
    preference_updates.navMode = 'command';
    variant_hints.hero = 'expertHero';
    variant_hints.quickActions = 'keyboardActions';
    variant_hints.sidePanel = 'insightsRail';
    reasoning.push(
      localize(useKorean, {
        en: 'The request sounded like an expert or analyst workflow.',
        ko: '요청이 숙련 분석가용 파워 화면에 가깝습니다.'
      })
    );
  }

  if (
    includesAny(normalized, ['키보드', '단축키', '명령', 'command', 'shortcut'])
  ) {
    preference_updates.navMode = 'command';
    variant_hints.primaryNav = 'commandNav';
    variant_hints.quickActions = 'keyboardActions';
    reasoning.push(
      localize(useKorean, {
        en: 'The request emphasized keyboard-heavy navigation.',
        ko: '요청에서 키보드 중심 탐색과 명령 흐름이 중요했습니다.'
      })
    );
  }

  if (
    preference_updates.defaultView === 'chart' &&
    preference_updates.navMode === 'command' &&
    preference_updates.expertise === undefined
  ) {
    preference_updates.expertise = 'expert';
    variant_hints.hero = 'expertHero';
    reasoning.push(
      localize(useKorean, {
        en: 'Combined chart-first and command-first intent implies an analyst-style power surface.',
        ko: '차트 우선과 명령 중심 의도가 함께 보여 분석 작업용 파워 화면으로 해석했습니다.'
      })
    );
  }

  if (includesAny(normalized, ['모바일', '폰', '휴대폰', 'mobile'])) {
    preference_updates.navMode = 'bottom';
    preference_updates.density = 'comfortable';
    preference_updates.contentMode = 'summary';
    variant_hints.primaryNav = 'bottomNav';
    variant_hints.hero = 'mobileHero';
    context_patch.viewport = { width: 390, height: 844 };
    context_patch.deviceCategory = 'mobile';
    context_patch.pointerType = 'coarse';
    context_patch.inputModality = 'touch';
    reasoning.push(
      localize(useKorean, {
        en: 'The request targeted a mobile quick-check context.',
        ko: '요청을 모바일 빠른 확인 상황으로 해석했습니다.'
      })
    );
  }

  if (includesAny(normalized, ['사이드바', 'sidebar'])) {
    preference_updates.navMode = 'sidebar';
    variant_hints.primaryNav = 'sidebarNav';
    reasoning.push(
      localize(useKorean, {
        en: 'The request explicitly asked for sidebar navigation.',
        ko: '요청에서 사이드바 탐색을 직접 지정했습니다.'
      })
    );
  }

  if (includesAny(normalized, ['탭', 'tabs'])) {
    preference_updates.navMode = 'tabs';
    variant_hints.primaryNav = 'tabsNav';
    reasoning.push(
      localize(useKorean, {
        en: 'The request explicitly asked for tabbed navigation.',
        ko: '요청에서 탭 기반 탐색을 직접 지정했습니다.'
      })
    );
  }

  if (includesAny(normalized, ['하단', 'bottom'])) {
    preference_updates.navMode = 'bottom';
    variant_hints.primaryNav = 'bottomNav';
    reasoning.push(
      localize(useKorean, {
        en: 'The request explicitly asked for bottom navigation.',
        ko: '요청에서 하단 탐색을 직접 지정했습니다.'
      })
    );
  }

  if (includesAny(normalized, ['요약', 'summary'])) {
    preference_updates.contentMode = 'summary';
    variant_hints.summaryPanel = 'summaryCards';
    reasoning.push(
      localize(useKorean, {
        en: 'The request emphasized summary-first information.',
        ko: '요청에서 요약 정보 우선 구성을 원했습니다.'
      })
    );
  }

  if (includesAny(normalized, ['상세', 'detailed'])) {
    preference_updates.contentMode = 'detailed';
    variant_hints.summaryPanel = 'detailedSummary';
    reasoning.push(
      localize(useKorean, {
        en: 'The request emphasized detailed information.',
        ko: '요청에서 상세 정보 노출을 원했습니다.'
      })
    );
  }

  if (includesAny(normalized, ['점진', '단계', 'progressive'])) {
    preference_updates.contentMode = 'progressive';
    variant_hints.summaryPanel = 'progressiveSummary';
    reasoning.push(
      localize(useKorean, {
        en: 'The request favored progressive disclosure.',
        ko: '요청에서 점진적 공개 방식을 선호했습니다.'
      })
    );
  }

  if (includesAny(normalized, ['다크', 'dark'])) {
    preference_updates.theme = 'dark';
    reasoning.push(
      localize(useKorean, {
        en: 'The request explicitly asked for dark theme.',
        ko: '요청에서 다크 테마를 직접 지정했습니다.'
      })
    );
  }

  if (includesAny(normalized, ['라이트', 'light'])) {
    preference_updates.theme = 'light';
    reasoning.push(
      localize(useKorean, {
        en: 'The request explicitly asked for light theme.',
        ko: '요청에서 라이트 테마를 직접 지정했습니다.'
      })
    );
  }

  if (includesAny(normalized, ['고대비', 'contrast'])) {
    preference_updates.contrast = 'more';
    context_patch.highContrast = true;
    reasoning.push(
      localize(useKorean, {
        en: 'The request explicitly asked for stronger contrast.',
        ko: '요청에서 더 강한 대비를 직접 지정했습니다.'
      })
    );
  }

  if (
    includesAny(normalized, [
      '모션 줄',
      '애니메이션 줄',
      'reduced motion',
      '움직임 적게'
    ])
  ) {
    preference_updates.motion = 'reduced';
    context_patch.reducedMotion = true;
    reasoning.push(
      localize(useKorean, {
        en: 'The request explicitly asked for less motion.',
        ko: '요청에서 모션을 줄여 달라고 직접 지정했습니다.'
      })
    );
  }

  if (includesAny(normalized, ['압축', '빽빽', 'compact'])) {
    preference_updates.density = 'compact';
    reasoning.push(
      localize(useKorean, {
        en: 'The request asked for a denser layout.',
        ko: '요청에서 더 압축된 밀도를 원했습니다.'
      })
    );
  }

  if (includesAny(normalized, ['여유', '편하게', 'comfortable'])) {
    preference_updates.density = 'comfortable';
    reasoning.push(
      localize(useKorean, {
        en: 'The request asked for a more spacious layout.',
        ko: '요청에서 더 여유 있는 밀도를 원했습니다.'
      })
    );
  }

  if (includesAny(normalized, ['집중', 'focus'])) {
    preference_updates.layoutBias = 'focus';
    reasoning.push(
      localize(useKorean, {
        en: 'The request emphasized a focused layout.',
        ko: '요청에서 집중형 레이아웃을 강조했습니다.'
      })
    );
  }

  if (includesAny(normalized, ['개요', 'overview'])) {
    preference_updates.layoutBias = 'overview';
    reasoning.push(
      localize(useKorean, {
        en: 'The request emphasized an overview layout.',
        ko: '요청에서 개요 중심 레이아웃을 강조했습니다.'
      })
    );
  }

  if (includesAny(normalized, ['비교', 'compare'])) {
    preference_updates.layoutBias = 'compare';
    reasoning.push(
      localize(useKorean, {
        en: 'The request emphasized side-by-side comparison.',
        ko: '요청에서 비교 중심 레이아웃을 강조했습니다.'
      })
    );
  }

  if (
    includesAny(normalized, [
      '빠른 액션',
      'cta',
      '버튼 크게',
      '승인 빨리',
      'quick action'
    ])
  ) {
    variant_hints.quickActions = 'prominentActions';
    reasoning.push(
      localize(useKorean, {
        en: 'The request emphasized prominent quick actions.',
        ko: '요청에서 빠른 액션과 주요 버튼 노출을 더 강조했습니다.'
      })
    );
  }

  if (includesAny(normalized, ['패널 접기', '간단히', 'minimal', '덜 복잡'])) {
    variant_hints.sidePanel = 'collapsedRail';
    reasoning.push(
      localize(useKorean, {
        en: 'The request asked for a simpler or more collapsed support rail.',
        ko: '요청에서 보조 패널을 더 간단하게 접은 상태로 두기를 원했습니다.'
      })
    );
  }

  if (reasoning.length === 0) {
    if (useKorean) {
      suggested_prompts.push(
        '차트를 먼저 보고 싶고 키보드로 빠르게 이동하고 싶어요.',
        '처음 쓰는 관리자라서 요약과 가이드가 먼저 보였으면 좋겠어요.',
        '모바일에서 승인만 빨리 처리할 수 있게 간단한 화면으로 보여주세요.'
      );
    } else {
      suggested_prompts.push(
        'Show charts first and let me move quickly with the keyboard.',
        'I am new here, so start with summaries and visible guidance.',
        'Keep the mobile screen simple so I can approve tasks quickly.'
      );
    }
    reasoning.push(
      localize(useKorean, {
        en: 'The request was too broad, so the compiler kept the current safe surface and suggested more specific prompts.',
        ko: '요청이 너무 넓어서 현재 안전한 surface를 유지하고 더 구체적인 요청 예시를 제안했습니다.'
      })
    );
  }

  return {
    summary:
      reasoning.length === 1 && suggested_prompts.length > 0
        ? localize(useKorean, {
            en: 'More detail is needed to reshape the current surface safely.',
            ko: '현재 화면을 안전하게 바꾸려면 조금 더 구체적인 요청이 필요합니다.'
          })
        : localize(useKorean, {
            en: 'A safe screen recommendation was generated from the user request.',
            ko: '사용자 요청을 바탕으로 안전한 화면 추천을 생성했습니다.'
          }),
    message_to_user:
      reasoning.length === 1 && suggested_prompts.length > 0
        ? localize(useKorean, {
            en: 'Please provide a more specific screen request so it can be applied immediately.',
            ko: '요청을 바로 적용할 수 있도록 더 구체적인 화면 의도를 입력해 주세요.'
          })
        : localize(useKorean, {
            en: 'The request was applied immediately inside the existing design system and surface contract.',
            ko: '입력한 요구를 기존 디자인 시스템과 surface 계약 안에서 즉시 반영했습니다.'
          }),
    reasoning,
    confidence: Math.min(0.35 + reasoning.length * 0.1, 0.94),
    preference_updates,
    context_patch,
    variant_hints,
    unsupported_requests: [],
    suggested_prompts
  };
}

export function createHeuristicAdaptiveIntentCompiler(): AdaptiveIntentCompiler {
  return {
    async compile<TSurface extends SurfaceSchema>(
      input: AdaptiveIntentInput<TSurface>
    ): Promise<AdaptiveIntentRecommendation<TSurface['id']>> {
      return normalizeAdaptiveIntentRecommendation(
        input.surface,
        input.userRequest,
        createHeuristicPayload(input)
      ) as AdaptiveIntentRecommendation<TSurface['id']>;
    }
  };
}
