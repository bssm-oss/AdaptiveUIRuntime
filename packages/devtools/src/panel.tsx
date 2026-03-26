import { useMemo } from 'react';
import { useAdaptiveDevtools } from '@adaptive-ui/react';
import type { AdaptiveScenarioName } from '@adaptive-ui/react';

export interface AdaptiveDevtoolsLabels {
  ariaLabel: string;
  title: string;
  noSurfaceMounted: string;
  hide: string;
  pin: string;
  profile: string;
  density: string;
  theme: string;
  nav: string;
  expertise: string;
  learnedDenseUi: string;
  learnedCharts: string;
  learnedKeyboardFlow: string;
  learnedStableLayout: string;
  controls: string;
  freezeCurrentPlan: string;
  unfreeze: string;
  resetDefaults: string;
  clearSimulation: string;
  simulateNovice: string;
  simulateExpert: string;
  simulateMobile: string;
  highContrast: string;
  reducedMotion: string;
  simulation: string;
  simulationNames: Partial<Record<AdaptiveScenarioName, string>>;
  plan: string;
  layoutMode: string;
  disclosure: string;
  transition: string;
  confidence: string;
  cooldownZones: string;
  none: string;
  noPlanYet: string;
  zones: string;
  score: string;
  whyTrace: string;
  exposureLog: string;
}

export interface AdaptiveDevtoolsPanelProps {
  surfaceId?: string;
  labels?: Partial<AdaptiveDevtoolsLabels>;
}

const DEFAULT_LABELS: AdaptiveDevtoolsLabels = {
  ariaLabel: 'Adaptive UI devtools',
  title: 'Adaptive UI Devtools',
  noSurfaceMounted: 'No surface mounted',
  hide: 'Hide',
  pin: 'Pin',
  profile: 'Profile',
  density: 'Density',
  theme: 'Theme',
  nav: 'Nav',
  expertise: 'Expertise',
  learnedDenseUi: 'Learned dense UI',
  learnedCharts: 'Learned charts',
  learnedKeyboardFlow: 'Learned keyboard flow',
  learnedStableLayout: 'Learned stable layout',
  controls: 'Controls',
  freezeCurrentPlan: 'Freeze current plan',
  unfreeze: 'Unfreeze',
  resetDefaults: 'Reset defaults',
  clearSimulation: 'Clear simulation',
  simulateNovice: 'Simulate novice',
  simulateExpert: 'Simulate expert',
  simulateMobile: 'Simulate mobile',
  highContrast: 'High contrast',
  reducedMotion: 'Reduced motion',
  simulation: 'Simulation',
  simulationNames: {},
  plan: 'Plan',
  layoutMode: 'Layout mode',
  disclosure: 'Disclosure',
  transition: 'Transition',
  confidence: 'Confidence',
  cooldownZones: 'Cooldown zones',
  none: 'none',
  noPlanYet: 'No plan yet.',
  zones: 'Zones',
  score: 'score',
  whyTrace: 'Why trace',
  exposureLog: 'Exposure log'
};

const panelStyle: React.CSSProperties = {
  width: 360,
  maxHeight: '80vh',
  overflow: 'auto',
  background: 'var(--adaptive-devtools-bg, #111827)',
  color: 'var(--adaptive-devtools-fg, #e5eefb)',
  border: '1px solid rgba(148, 163, 184, 0.35)',
  borderRadius: 14,
  padding: 16,
  boxShadow: '0 18px 48px rgba(15, 23, 42, 0.35)',
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: 13,
  lineHeight: 1.5
};

const sectionStyle: React.CSSProperties = {
  borderTop: '1px solid rgba(148, 163, 184, 0.16)',
  marginTop: 12,
  paddingTop: 12
};

const tagStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  borderRadius: 999,
  border: '1px solid rgba(125, 211, 252, 0.2)',
  padding: '2px 8px',
  marginRight: 6,
  marginBottom: 6,
  background: 'rgba(14, 165, 233, 0.12)',
  color: '#bae6fd'
};

const buttonStyle: React.CSSProperties = {
  padding: '6px 10px',
  borderRadius: 10,
  border: '1px solid rgba(148, 163, 184, 0.3)',
  background: 'rgba(30, 41, 59, 0.8)',
  color: 'inherit',
  cursor: 'pointer'
};

export function AdaptiveDevtoolsPanel({
  surfaceId,
  labels: labelsProp
}: AdaptiveDevtoolsPanelProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const devtools = useAdaptiveDevtools();
  const activeSurfaceId = surfaceId ?? devtools.currentSurface;
  const plan = activeSurfaceId ? devtools.plans[activeSurfaceId] : undefined;
  const why = useMemo(
    () =>
      plan
        ? {
            summary: plan.reasoningTrace.map((item) => item.detail),
            zones: Object.fromEntries(
              Object.entries(plan.zones).map(([zoneName, zonePlan]) => [
                zoneName,
                zonePlan.contributions.filter(
                  (item) => item.status === 'applied'
                )
              ])
            )
          }
        : undefined,
    [plan]
  );

  return (
    <aside aria-label={labels.ariaLabel} style={panelStyle}>
      <header
        style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#94a3b8'
            }}
          >
            {labels.title}
          </div>
          <strong>{activeSurfaceId ?? labels.noSurfaceMounted}</strong>
        </div>
        <button
          onClick={() =>
            devtools.actions.setDevtoolsOpen(!devtools.devtoolsOpen)
          }
          style={buttonStyle}
          type="button"
        >
          {devtools.devtoolsOpen ? labels.hide : labels.pin}
        </button>
      </header>

      <section style={sectionStyle}>
        <strong>{labels.profile}</strong>
        <div style={{ marginTop: 8 }}>
          <span style={tagStyle}>
            {labels.density}: {devtools.profile.explicit.density}
          </span>
          <span style={tagStyle}>
            {labels.theme}: {devtools.profile.explicit.theme}
          </span>
          <span style={tagStyle}>
            {labels.nav}: {devtools.profile.explicit.navMode}
          </span>
          <span style={tagStyle}>
            {labels.expertise}: {devtools.profile.explicit.expertise}
          </span>
        </div>
        <div style={{ marginTop: 8 }}>
          <div>
            {labels.learnedDenseUi}:{' '}
            {devtools.profile.learned.prefersDenseUI.toFixed(2)}
          </div>
          <div>
            {labels.learnedCharts}:{' '}
            {devtools.profile.learned.prefersCharts.toFixed(2)}
          </div>
          <div>
            {labels.learnedKeyboardFlow}:{' '}
            {devtools.profile.learned.prefersKeyboardFlow.toFixed(2)}
          </div>
          <div>
            {labels.learnedStableLayout}:{' '}
            {devtools.profile.learned.prefersStableLayout.toFixed(2)}
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <strong>{labels.controls}</strong>
        <div
          style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}
        >
          <button
            onClick={() =>
              activeSurfaceId &&
              devtools.actions.freezeSurface(activeSurfaceId, true)
            }
            style={buttonStyle}
            type="button"
          >
            {labels.freezeCurrentPlan}
          </button>
          <button
            onClick={() =>
              activeSurfaceId &&
              devtools.actions.freezeSurface(activeSurfaceId, false)
            }
            style={buttonStyle}
            type="button"
          >
            {labels.unfreeze}
          </button>
          <button
            onClick={() => devtools.actions.resetPreferences()}
            style={buttonStyle}
            type="button"
          >
            {labels.resetDefaults}
          </button>
          <button
            onClick={() => devtools.actions.clearSimulation()}
            style={buttonStyle}
            type="button"
          >
            {labels.clearSimulation}
          </button>
        </div>
        <div
          style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}
        >
          <button
            onClick={() => devtools.actions.simulateScenario('novice')}
            style={buttonStyle}
            type="button"
          >
            {labels.simulateNovice}
          </button>
          <button
            onClick={() => devtools.actions.simulateScenario('expert')}
            style={buttonStyle}
            type="button"
          >
            {labels.simulateExpert}
          </button>
          <button
            onClick={() => devtools.actions.simulateScenario('mobile')}
            style={buttonStyle}
            type="button"
          >
            {labels.simulateMobile}
          </button>
          <button
            onClick={() => devtools.actions.simulateScenario('high-contrast')}
            style={buttonStyle}
            type="button"
          >
            {labels.highContrast}
          </button>
          <button
            onClick={() => devtools.actions.simulateScenario('reduced-motion')}
            style={buttonStyle}
            type="button"
          >
            {labels.reducedMotion}
          </button>
        </div>
        {devtools.simulation.label ? (
          <div style={{ marginTop: 8 }}>
            {labels.simulation}:{' '}
            {devtools.simulation.name
              ? (labels.simulationNames[devtools.simulation.name] ??
                devtools.simulation.label)
              : devtools.simulation.label}
          </div>
        ) : null}
      </section>

      <section style={sectionStyle}>
        <strong>{labels.plan}</strong>
        {plan ? (
          <div style={{ marginTop: 8 }}>
            <div>
              {labels.layoutMode}: {plan.layoutMode}
            </div>
            <div>
              {labels.disclosure}: {plan.disclosureLevel}
            </div>
            <div>
              {labels.transition}: {plan.transitionMode}
            </div>
            <div>
              {labels.confidence}: {plan.confidence.toFixed(2)}
            </div>
            <div>
              {labels.cooldownZones}:{' '}
              {Object.keys(plan.stability.cooldownUntil).join(', ') ||
                labels.none}
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 8, color: '#94a3b8' }}>
            {labels.noPlanYet}
          </div>
        )}
      </section>

      <section style={sectionStyle}>
        <strong>{labels.zones}</strong>
        {plan
          ? Object.entries(plan.zones).map(([zoneName, zonePlan]) => (
              <div
                key={zoneName}
                style={{
                  marginTop: 10,
                  paddingTop: 10,
                  borderTop: '1px solid rgba(148, 163, 184, 0.12)'
                }}
              >
                <div>
                  <strong>{zoneName}</strong>: {zonePlan.variantId}
                </div>
                <div style={{ color: '#94a3b8' }}>
                  {labels.score} {zonePlan.score.toFixed(2)} |{' '}
                  {labels.confidence} {zonePlan.confidence.toFixed(2)}
                </div>
                {zonePlan.contributions.map((contribution) => (
                  <div key={contribution.id} style={{ marginTop: 4 }}>
                    <span
                      style={{
                        color:
                          contribution.status === 'blocked'
                            ? '#fda4af'
                            : '#cbd5e1'
                      }}
                    >
                      {contribution.label}
                    </span>{' '}
                    <span>{contribution.contribution.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ))
          : null}
      </section>

      <section style={sectionStyle}>
        <strong>{labels.whyTrace}</strong>
        {why?.summary.map((line) => (
          <div key={line} style={{ marginTop: 6 }}>
            {line}
          </div>
        ))}
      </section>

      <section style={sectionStyle}>
        <strong>{labels.exposureLog}</strong>
        {devtools.events.slice(-6).map((event, index) => (
          <div key={`${event.type}-${index}`} style={{ marginTop: 6 }}>
            {event.type} {event.surfaceId ? `· ${event.surfaceId}` : ''}
          </div>
        ))}
      </section>
    </aside>
  );
}
