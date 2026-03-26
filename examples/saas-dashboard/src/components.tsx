import { useMemo } from 'react';
import type {
  AdaptiveRegisteredComponent,
  AdaptiveSlotComponentProps
} from '@adaptive-ui/react';

type DemoProps = AdaptiveSlotComponentProps & {
  title?: string;
};

type PanelStyle = React.CSSProperties & Record<'--panel-accent', string>;

function Panel({
  title,
  eyebrow,
  children,
  accent
}: {
  title: string;
  eyebrow?: string;
  accent?: string;
  children: React.ReactNode;
}) {
  const panelStyle: PanelStyle | undefined = accent
    ? { '--panel-accent': accent }
    : undefined;
  return (
    <section className="panel" style={panelStyle}>
      {eyebrow ? <div className="panel-eyebrow">{eyebrow}</div> : null}
      <div className="panel-title-row">
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Metric({
  label,
  value,
  delta
}: {
  label: string;
  value: string;
  delta: string;
}) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{delta}</small>
    </article>
  );
}

function InlinePill({ children }: { children: React.ReactNode }) {
  return <span className="inline-pill">{children}</span>;
}

function FakeChart({ kind = 'bar' }: { kind?: 'bar' | 'line' | 'radial' }) {
  return (
    <div className={`fake-chart fake-chart-${kind}`} aria-hidden="true">
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  );
}

function FakeTable() {
  return (
    <div className="fake-table" aria-label="매출 표 미리보기">
      <div className="fake-table-row fake-table-head">
        <span>세그먼트</span>
        <span>MRR</span>
        <span>전분기 대비</span>
      </div>
      {[
        ['엔터프라이즈', '$128k', '+14%'],
        ['성장', '$64k', '+9%'],
        ['파일럿', '$18k', '+23%']
      ].map(([segment, mrr, qoq]) => (
        <div className="fake-table-row" key={segment}>
          <span>{segment}</span>
          <span>{mrr}</span>
          <span>{qoq}</span>
        </div>
      ))}
    </div>
  );
}

export function SidebarNav({ trackBehavior }: DemoProps) {
  return (
    <Panel title="워크스페이스" eyebrow="사이드바 탐색">
      <nav aria-label="주요 탐색">
        <button className="nav-link nav-link-active" type="button">
          개요
        </button>
        <button className="nav-link" type="button">
          파이프라인
        </button>
        <button
          className="nav-link"
          type="button"
          onClick={() =>
            trackBehavior({
              type: 'keyboard_shortcut',
              surfaceId: 'dashboard.home'
            })
          }
        >
          명령 센터
        </button>
        <button className="nav-link" type="button">
          관리
        </button>
      </nav>
    </Panel>
  );
}

export function TabsNav() {
  return (
    <Panel title="섹션" eyebrow="탭 탐색">
      <div className="tab-strip" role="tablist" aria-label="섹션 탭">
        <button
          className="tab-pill tab-pill-active"
          role="tab"
          aria-selected="true"
          type="button"
        >
          개요
        </button>
        <button
          className="tab-pill"
          role="tab"
          aria-selected="false"
          type="button"
        >
          매출
        </button>
        <button
          className="tab-pill"
          role="tab"
          aria-selected="false"
          type="button"
        >
          활동
        </button>
      </div>
    </Panel>
  );
}

export function BottomNav() {
  return (
    <Panel title="빠른 이동" eyebrow="하단 탐색">
      <nav className="bottom-nav" aria-label="하단 탐색">
        <button type="button">홈</button>
        <button type="button">지표</button>
        <button type="button">업무</button>
        <button type="button">받은함</button>
      </nav>
    </Panel>
  );
}

export function CommandNav({ trackBehavior }: DemoProps) {
  return (
    <Panel title="명령 중심 탐색" eyebrow="키보드 중심">
      <button
        className="command-launch"
        type="button"
        onClick={() =>
          trackBehavior({
            type: 'command_palette_opened',
            surfaceId: 'dashboard.home',
            zoneName: 'primaryNav'
          })
        }
      >
        <kbd>K</kbd> 로 명령 팔레트를 열기
      </button>
      <div className="command-hints">
        <InlinePill>화면 이동</InlinePill>
        <InlinePill>빠른 액션 실행</InlinePill>
        <InlinePill>비교 보기 열기</InlinePill>
      </div>
    </Panel>
  );
}

export function NoviceHero() {
  return (
    <Panel
      title="신호부터 먼저 보도록 정리된 화면"
      eyebrow="초보자 지원"
      accent="rgba(37, 99, 235, 0.2)"
    >
      <p className="hero-copy">
        주간 요약 카드, 가이드 문구, 주요 액션을 먼저 보여줘서 복잡한 표나 세부
        분석 전에 핵심 상황을 파악하게 합니다.
      </p>
      <div className="hero-actions">
        <button className="primary-button" type="button">
          이번 주 병목 확인
        </button>
        <button className="secondary-button" type="button">
          대시보드 익히기
        </button>
      </div>
    </Panel>
  );
}

export function ExpertHero() {
  return (
    <Panel
      title="분석 작업에 맞춘 파워 화면"
      eyebrow="전문가 모드"
      accent="rgba(14, 165, 233, 0.18)"
    >
      <p className="hero-copy">
        숙련 사용자와 키보드 중심 행동 신호가 강할수록 압축 밀도, 빠른 명령,
        차트 우선 흐름이 강화됩니다.
      </p>
      <div className="hero-stats">
        <InlinePill>지연 시간 18ms</InlinePill>
        <InlinePill>경고 3건 분류</InlinePill>
        <InlinePill>워크플로 2개 준비</InlinePill>
      </div>
    </Panel>
  );
}

export function MobileHero() {
  return (
    <Panel
      title="모바일에서 빠르게 확인하는 화면"
      eyebrow="모바일 요약"
      accent="rgba(56, 189, 248, 0.18)"
    >
      <p className="hero-copy">
        터치 친화적 간격과 요약 지표를 우선 노출하고, 부차적인 크롬은 하단
        탐색으로 접어 모바일 확인 흐름을 가볍게 유지합니다.
      </p>
      <div className="hero-actions">
        <button className="primary-button" type="button">
          승인 처리
        </button>
      </div>
    </Panel>
  );
}

export function SummaryCards() {
  return (
    <Panel title="주간 요약" eyebrow="요약 우선">
      <div className="metric-grid">
        <Metric label="파이프라인 상태" value="92%" delta="+3.4%" />
        <Metric label="SLA 위험" value="4" delta="-2" />
        <Metric label="확장 준비 계정" value="11" delta="+5" />
      </div>
    </Panel>
  );
}

export function DetailedSummary({ trackBehavior }: DemoProps) {
  return (
    <Panel title="상세 요약" eyebrow="상세 모드">
      <div className="panel-stack">
        <Metric label="확정 가능 매출" value="$210k" delta="+18%" />
        <Metric label="파이프라인 속도" value="26일" delta="-3일" />
        <button
          className="secondary-button"
          type="button"
          onClick={() =>
            trackBehavior({
              type: 'detail_expanded',
              surfaceId: 'dashboard.home',
              zoneName: 'summaryPanel'
            })
          }
        >
          상세 요약을 기본으로 유지
        </button>
      </div>
    </Panel>
  );
}

export function ProgressiveSummary({ trackBehavior }: DemoProps) {
  return (
    <Panel title="점진적 공개" eyebrow="단계별 탐색">
      <div className="panel-stack">
        <p>
          먼저 가장 중요한 세 가지 수치를 보여주고, 필요할 때만 보조 맥락과
          설명을 확장하도록 설계된 흐름입니다.
        </p>
        <button
          className="secondary-button"
          type="button"
          onClick={() =>
            trackBehavior({
              type: 'detail_expanded',
              surfaceId: 'dashboard.home',
              zoneName: 'summaryPanel'
            })
          }
        >
          보조 맥락 펼치기
        </button>
      </div>
    </Panel>
  );
}

export function TablePowerView({ trackBehavior }: DemoProps) {
  return (
    <Panel title="파이프라인 표" eyebrow="표 우선 기본 화면">
      <FakeTable />
      <div className="toolbar-row">
        <button
          className="secondary-button"
          type="button"
          onClick={() =>
            trackBehavior({
              type: 'table_interaction',
              surfaceId: 'dashboard.home',
              zoneName: 'mainContent'
            })
          }
        >
          MRR 기준 정렬
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={() =>
            trackBehavior({
              type: 'table_interaction',
              surfaceId: 'dashboard.home',
              zoneName: 'mainContent'
            })
          }
        >
          위험 계정만 보기
        </button>
      </div>
    </Panel>
  );
}

export function ChartPowerView({ trackBehavior }: DemoProps) {
  return (
    <Panel title="매출 추이" eyebrow="차트 우선 기본 화면">
      <FakeChart kind="line" />
      <div className="toolbar-row">
        <button
          className="secondary-button"
          type="button"
          onClick={() =>
            trackBehavior({
              type: 'chart_interaction',
              surfaceId: 'dashboard.home',
              zoneName: 'mainContent'
            })
          }
        >
          코호트 비교
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={() =>
            trackBehavior({
              type: 'chart_interaction',
              surfaceId: 'dashboard.home',
              zoneName: 'mainContent'
            })
          }
        >
          변동 원인 보기
        </button>
      </div>
    </Panel>
  );
}

export function CardPowerView({ trackBehavior }: DemoProps) {
  const cards = useMemo(
    () => [
      { label: '에스컬레이션', value: '4', trend: '검토 필요' },
      { label: '승인 대기', value: '8', trend: '대기 중' },
      { label: '갱신 예정', value: '12', trend: '이번 주' }
    ],
    []
  );

  return (
    <Panel title="카드 스택" eyebrow="카드 우선 기본 화면">
      <div className="metric-grid">
        {cards.map((card) => (
          <Metric
            key={card.label}
            label={card.label}
            value={card.value}
            delta={card.trend}
          />
        ))}
      </div>
      <button
        className="secondary-button"
        type="button"
        onClick={() =>
          trackBehavior({
            type: 'surface_viewed',
            surfaceId: 'dashboard.home',
            zoneName: 'mainContent'
          })
        }
      >
        카드 새로고침
      </button>
    </Panel>
  );
}

export function OnboardingRail() {
  return (
    <Panel title="다음 단계 가이드" eyebrow="온보딩 패널">
      <ol className="step-list">
        <li>상세 표를 열기 전에 먼저 요약 카드로 전체 상황을 확인합니다.</li>
        <li>반복 작업은 빠른 액션에서 먼저 처리합니다.</li>
        <li>레이아웃이 낯설면 언제든 기본값으로 초기화할 수 있습니다.</li>
      </ol>
    </Panel>
  );
}

export function InsightsRail({ trackBehavior }: DemoProps) {
  return (
    <Panel title="분석 인사이트" eyebrow="보조 패널">
      <div className="panel-stack">
        <div className="insight-card">
          <strong>ARR 구성</strong>
          <span>엔터프라이즈 비중이 예상보다 빠르게 올라가고 있습니다.</span>
        </div>
        <div className="insight-card">
          <strong>주의 목록</strong>
          <span>APAC 갱신은 아직 수동 확인이 필요합니다.</span>
        </div>
        <button
          className="secondary-button"
          type="button"
          onClick={() =>
            trackBehavior({
              type: 'widget_collapsed',
              moduleId: 'sidePanel',
              surfaceId: 'dashboard.home',
              zoneName: 'sidePanel'
            })
          }
        >
          패널 접기
        </button>
      </div>
    </Panel>
  );
}

export function CollapsedRail({ trackBehavior }: DemoProps) {
  return (
    <Panel title="패널이 접힌 상태" eyebrow="안정성 가드">
      <button
        className="secondary-button"
        type="button"
        onClick={() =>
          trackBehavior({
            type: 'widget_expanded',
            moduleId: 'sidePanel',
            surfaceId: 'dashboard.home',
            zoneName: 'sidePanel'
          })
        }
      >
        보조 패널 펼치기
      </button>
    </Panel>
  );
}

export function ProminentActions({ trackBehavior }: DemoProps) {
  return (
    <Panel title="빠른 액션" eyebrow="주요 CTA 강조">
      <div className="action-grid">
        <button
          className="primary-button"
          type="button"
          onClick={() =>
            trackBehavior({
              type: 'quick_action_used',
              surfaceId: 'dashboard.home',
              zoneName: 'quickActions'
            })
          }
        >
          요청 승인
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={() =>
            trackBehavior({
              type: 'quick_action_used',
              surfaceId: 'dashboard.home',
              zoneName: 'quickActions'
            })
          }
        >
          주간 브리프 내보내기
        </button>
      </div>
    </Panel>
  );
}

export function MinimalActions() {
  return (
    <Panel title="빠른 액션" eyebrow="최소 강조">
      <div className="action-grid">
        <button className="secondary-button" type="button">
          내보내기
        </button>
        <button className="secondary-button" type="button">
          담당 지정
        </button>
      </div>
    </Panel>
  );
}

export function KeyboardActions({ trackBehavior }: DemoProps) {
  return (
    <Panel title="키보드 액션" eyebrow="명령 중심">
      <div className="panel-stack">
        <button
          className="primary-button"
          type="button"
          onClick={() =>
            trackBehavior({
              type: 'keyboard_shortcut',
              surfaceId: 'dashboard.home',
              zoneName: 'quickActions'
            })
          }
        >
          매크로 실행
        </button>
        <div className="command-hints">
          <InlinePill>G 다음 P</InlinePill>
          <InlinePill>Shift /</InlinePill>
          <InlinePill>Ctrl .</InlinePill>
        </div>
      </div>
    </Panel>
  );
}

export const componentRegistry = {
  SidebarNav,
  TabsNav,
  BottomNav,
  CommandNav,
  NoviceHero,
  ExpertHero,
  MobileHero,
  SummaryCards,
  DetailedSummary,
  ProgressiveSummary,
  TablePowerView,
  ChartPowerView,
  CardPowerView,
  OnboardingRail,
  InsightsRail,
  CollapsedRail,
  ProminentActions,
  MinimalActions,
  KeyboardActions
} satisfies Record<string, AdaptiveRegisteredComponent>;
