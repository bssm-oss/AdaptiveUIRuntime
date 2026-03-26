import { useMemo } from 'react';
import { useAdaptiveDevtools } from '@adaptive-ui/react';

export interface AdaptiveDevtoolsPanelProps {
  surfaceId?: string;
}

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
  surfaceId
}: AdaptiveDevtoolsPanelProps) {
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
    <aside aria-label="Adaptive UI devtools" style={panelStyle}>
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
            Adaptive UI Devtools
          </div>
          <strong>{activeSurfaceId ?? 'No surface mounted'}</strong>
        </div>
        <button
          onClick={() =>
            devtools.actions.setDevtoolsOpen(!devtools.devtoolsOpen)
          }
          style={buttonStyle}
          type="button"
        >
          {devtools.devtoolsOpen ? 'Hide' : 'Pin'}
        </button>
      </header>

      <section style={sectionStyle}>
        <strong>Profile</strong>
        <div style={{ marginTop: 8 }}>
          <span style={tagStyle}>
            Density: {devtools.profile.explicit.density}
          </span>
          <span style={tagStyle}>Theme: {devtools.profile.explicit.theme}</span>
          <span style={tagStyle}>Nav: {devtools.profile.explicit.navMode}</span>
          <span style={tagStyle}>
            Expertise: {devtools.profile.explicit.expertise}
          </span>
        </div>
        <div style={{ marginTop: 8 }}>
          <div>
            Learned dense UI:{' '}
            {devtools.profile.learned.prefersDenseUI.toFixed(2)}
          </div>
          <div>
            Learned charts: {devtools.profile.learned.prefersCharts.toFixed(2)}
          </div>
          <div>
            Learned keyboard flow:{' '}
            {devtools.profile.learned.prefersKeyboardFlow.toFixed(2)}
          </div>
          <div>
            Learned stable layout:{' '}
            {devtools.profile.learned.prefersStableLayout.toFixed(2)}
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        <strong>Controls</strong>
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
            Freeze current plan
          </button>
          <button
            onClick={() =>
              activeSurfaceId &&
              devtools.actions.freezeSurface(activeSurfaceId, false)
            }
            style={buttonStyle}
            type="button"
          >
            Unfreeze
          </button>
          <button
            onClick={() => devtools.actions.resetPreferences()}
            style={buttonStyle}
            type="button"
          >
            Reset defaults
          </button>
          <button
            onClick={() => devtools.actions.clearSimulation()}
            style={buttonStyle}
            type="button"
          >
            Clear simulation
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
            Simulate novice
          </button>
          <button
            onClick={() => devtools.actions.simulateScenario('expert')}
            style={buttonStyle}
            type="button"
          >
            Simulate expert
          </button>
          <button
            onClick={() => devtools.actions.simulateScenario('mobile')}
            style={buttonStyle}
            type="button"
          >
            Simulate mobile
          </button>
          <button
            onClick={() => devtools.actions.simulateScenario('high-contrast')}
            style={buttonStyle}
            type="button"
          >
            High contrast
          </button>
          <button
            onClick={() => devtools.actions.simulateScenario('reduced-motion')}
            style={buttonStyle}
            type="button"
          >
            Reduced motion
          </button>
        </div>
        {devtools.simulation.label ? (
          <div style={{ marginTop: 8 }}>
            Simulation: {devtools.simulation.label}
          </div>
        ) : null}
      </section>

      <section style={sectionStyle}>
        <strong>Plan</strong>
        {plan ? (
          <div style={{ marginTop: 8 }}>
            <div>Layout mode: {plan.layoutMode}</div>
            <div>Disclosure: {plan.disclosureLevel}</div>
            <div>Transition: {plan.transitionMode}</div>
            <div>Confidence: {plan.confidence.toFixed(2)}</div>
            <div>
              Cooldown zones:{' '}
              {Object.keys(plan.stability.cooldownUntil).join(', ') || 'none'}
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 8, color: '#94a3b8' }}>No plan yet.</div>
        )}
      </section>

      <section style={sectionStyle}>
        <strong>Zones</strong>
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
                  score {zonePlan.score.toFixed(2)} | confidence{' '}
                  {zonePlan.confidence.toFixed(2)}
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
        <strong>Why trace</strong>
        {why?.summary.map((line) => (
          <div key={line} style={{ marginTop: 6 }}>
            {line}
          </div>
        ))}
      </section>

      <section style={sectionStyle}>
        <strong>Exposure log</strong>
        {devtools.events.slice(-6).map((event, index) => (
          <div key={`${event.type}-${index}`} style={{ marginTop: 6 }}>
            {event.type} {event.surfaceId ? `· ${event.surfaceId}` : ''}
          </div>
        ))}
      </section>
    </aside>
  );
}
