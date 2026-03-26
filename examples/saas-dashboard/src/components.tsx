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
    <div className="fake-table" aria-label="Revenue table preview">
      <div className="fake-table-row fake-table-head">
        <span>Segment</span>
        <span>MRR</span>
        <span>QoQ</span>
      </div>
      {[
        ['Enterprise', '$128k', '+14%'],
        ['Growth', '$64k', '+9%'],
        ['Pilot', '$18k', '+23%']
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
    <Panel title="Workspace" eyebrow="Sidebar navigation">
      <nav aria-label="Primary">
        <button className="nav-link nav-link-active" type="button">
          Overview
        </button>
        <button className="nav-link" type="button">
          Pipelines
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
          Command center
        </button>
        <button className="nav-link" type="button">
          Admin
        </button>
      </nav>
    </Panel>
  );
}

export function TabsNav() {
  return (
    <Panel title="Sections" eyebrow="Tabbed navigation">
      <div className="tab-strip" role="tablist" aria-label="Sections">
        <button
          className="tab-pill tab-pill-active"
          role="tab"
          aria-selected="true"
          type="button"
        >
          Overview
        </button>
        <button
          className="tab-pill"
          role="tab"
          aria-selected="false"
          type="button"
        >
          Revenue
        </button>
        <button
          className="tab-pill"
          role="tab"
          aria-selected="false"
          type="button"
        >
          Activity
        </button>
      </div>
    </Panel>
  );
}

export function BottomNav() {
  return (
    <Panel title="Quick routes" eyebrow="Bottom navigation">
      <nav className="bottom-nav" aria-label="Bottom navigation">
        <button type="button">Home</button>
        <button type="button">Stats</button>
        <button type="button">Tasks</button>
        <button type="button">Inbox</button>
      </nav>
    </Panel>
  );
}

export function CommandNav({ trackBehavior }: DemoProps) {
  return (
    <Panel title="Command-first" eyebrow="Keyboard-centric navigation">
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
        Press <kbd>K</kbd> to open palette
      </button>
      <div className="command-hints">
        <InlinePill>Jump to surface</InlinePill>
        <InlinePill>Run quick actions</InlinePill>
        <InlinePill>Open compare view</InlinePill>
      </div>
    </Panel>
  );
}

export function NoviceHero() {
  return (
    <Panel
      title="Start with the signal, not the noise"
      eyebrow="Novice assist"
      accent="rgba(37, 99, 235, 0.2)"
    >
      <p className="hero-copy">
        This layout keeps weekly summary cards, guidance prompts, and the
        primary call to action above the fold.
      </p>
      <div className="hero-actions">
        <button className="primary-button" type="button">
          Review this week&apos;s blockers
        </button>
        <button className="secondary-button" type="button">
          Learn the dashboard
        </button>
      </div>
    </Panel>
  );
}

export function ExpertHero() {
  return (
    <Panel
      title="Power surface tuned for analysis"
      eyebrow="Expert mode"
      accent="rgba(14, 165, 233, 0.18)"
    >
      <p className="hero-copy">
        The runtime favors compact scanability, quick commands, and chart-first
        workflows when expert and keyboard-heavy signals are strong.
      </p>
      <div className="hero-stats">
        <InlinePill>Latency 18ms</InlinePill>
        <InlinePill>3 alerts triaged</InlinePill>
        <InlinePill>2 workflows staged</InlinePill>
      </div>
    </Panel>
  );
}

export function MobileHero() {
  return (
    <Panel
      title="Quick check"
      eyebrow="Mobile summary"
      accent="rgba(56, 189, 248, 0.18)"
    >
      <p className="hero-copy">
        Touch-friendly summary cards stay visible while secondary chrome
        collapses into the bottom nav.
      </p>
      <div className="hero-actions">
        <button className="primary-button" type="button">
          Resolve approvals
        </button>
      </div>
    </Panel>
  );
}

export function SummaryCards() {
  return (
    <Panel title="Weekly summary" eyebrow="Summary-first">
      <div className="metric-grid">
        <Metric label="Pipeline health" value="92%" delta="+3.4%" />
        <Metric label="SLA at risk" value="4" delta="-2" />
        <Metric label="Expansion ready" value="11" delta="+5" />
      </div>
    </Panel>
  );
}

export function DetailedSummary({ trackBehavior }: DemoProps) {
  return (
    <Panel title="Detailed summary" eyebrow="Detailed mode">
      <div className="panel-stack">
        <Metric label="Qualified revenue" value="$210k" delta="+18%" />
        <Metric label="Pipeline velocity" value="26d" delta="-3d" />
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
          Keep detailed summary expanded
        </button>
      </div>
    </Panel>
  );
}

export function ProgressiveSummary({ trackBehavior }: DemoProps) {
  return (
    <Panel title="Progressive disclosure" eyebrow="Step-by-step">
      <div className="panel-stack">
        <p>
          Show the three most important numbers first, then let the user expand
          supporting context when needed.
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
          Reveal the supporting context
        </button>
      </div>
    </Panel>
  );
}

export function TablePowerView({ trackBehavior }: DemoProps) {
  return (
    <Panel title="Pipeline table" eyebrow="Table-first default">
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
          Sort by MRR
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
          Filter at-risk accounts
        </button>
      </div>
    </Panel>
  );
}

export function ChartPowerView({ trackBehavior }: DemoProps) {
  return (
    <Panel title="Revenue contour" eyebrow="Chart-first default">
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
          Compare cohorts
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
          Drill into variance
        </button>
      </div>
    </Panel>
  );
}

export function CardPowerView({ trackBehavior }: DemoProps) {
  const cards = useMemo(
    () => [
      { label: 'Escalations', value: '4', trend: 'Needs review' },
      { label: 'Approvals', value: '8', trend: 'Queued' },
      { label: 'Renewals', value: '12', trend: 'This week' }
    ],
    []
  );

  return (
    <Panel title="Card stack" eyebrow="Card-first default">
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
        Refresh cards
      </button>
    </Panel>
  );
}

export function OnboardingRail() {
  return (
    <Panel title="Guided next steps" eyebrow="Onboarding rail">
      <ol className="step-list">
        <li>Review summary cards before opening the full pipeline.</li>
        <li>Use quick actions for common approval tasks.</li>
        <li>Reset to defaults if the layout feels unfamiliar.</li>
      </ol>
    </Panel>
  );
}

export function InsightsRail({ trackBehavior }: DemoProps) {
  return (
    <Panel title="Analyst insights" eyebrow="Support rail">
      <div className="panel-stack">
        <div className="insight-card">
          <strong>ARR mix</strong>
          <span>Enterprise share is climbing faster than forecast.</span>
        </div>
        <div className="insight-card">
          <strong>Watchlist</strong>
          <span>APAC renewals still need manual intervention.</span>
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
          Collapse rail
        </button>
      </div>
    </Panel>
  );
}

export function CollapsedRail({ trackBehavior }: DemoProps) {
  return (
    <Panel title="Rail collapsed" eyebrow="Stable layout guard">
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
        Expand support rail
      </button>
    </Panel>
  );
}

export function ProminentActions({ trackBehavior }: DemoProps) {
  return (
    <Panel title="Quick actions" eyebrow="Primary CTA prominence">
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
          Approve requests
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
          Export weekly brief
        </button>
      </div>
    </Panel>
  );
}

export function MinimalActions() {
  return (
    <Panel title="Quick actions" eyebrow="Minimal emphasis">
      <div className="action-grid">
        <button className="secondary-button" type="button">
          Export
        </button>
        <button className="secondary-button" type="button">
          Assign
        </button>
      </div>
    </Panel>
  );
}

export function KeyboardActions({ trackBehavior }: DemoProps) {
  return (
    <Panel title="Keyboard actions" eyebrow="Command heavy">
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
          Trigger staged macro
        </button>
        <div className="command-hints">
          <InlinePill>G then P</InlinePill>
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
