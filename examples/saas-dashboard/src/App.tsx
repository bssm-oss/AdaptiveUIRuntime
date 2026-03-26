import {
  createAdaptiveEngine,
  createLocalStorageAdapter
} from '@adaptive-ui/core';
import {
  AdaptiveProvider,
  AdaptiveSlot,
  AdaptiveSurface,
  useAdaptiveActions,
  useAdaptivePlan,
  useAdaptivePreference,
  useAdaptiveWhy
} from '@adaptive-ui/react';
import { AdaptiveDevtoolsOverlay } from '@adaptive-ui/devtools';
import { componentRegistry } from './components';
import { dashboardHomeSurface } from './dashboardSchema';

const engine = createAdaptiveEngine({
  storage: createLocalStorageAdapter('adaptive-ui.example.dashboard'),
  learnedPersistenceThrottleMs: 1_000,
  surfaces: [dashboardHomeSurface]
});

function PreferenceSelect<TValue extends string>({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: TValue;
  onChange: (value: TValue) => void;
  options: TValue[];
}) {
  return (
    <label className="control">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as TValue)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
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
        <div className="eyebrow">Constrained adaptation runtime</div>
        <h1>Per-user UI, without freeform UI generation</h1>
        <p className="lede">
          This dashboard swaps variants inside approved slots and token packs.
          Accessibility, explicit settings, and stability rules always win over
          automatic optimization.
        </p>
      </div>
      <div className="control-grid">
        <PreferenceSelect
          label="Theme"
          value={theme.value}
          onChange={theme.setValue}
          options={['system', 'light', 'dark']}
        />
        <PreferenceSelect
          label="Density"
          value={density.value}
          onChange={density.setValue}
          options={['auto', 'compact', 'comfortable']}
        />
        <PreferenceSelect
          label="Navigation"
          value={navMode.value}
          onChange={navMode.setValue}
          options={['auto', 'sidebar', 'tabs', 'bottom', 'command']}
        />
      </div>
      <div className="scenario-row">
        <button
          className="scenario-button"
          type="button"
          onClick={() => actions.simulateScenario('novice')}
        >
          Novice manager
        </button>
        <button
          className="scenario-button"
          type="button"
          onClick={() => actions.simulateScenario('expert')}
        >
          Expert analyst
        </button>
        <button
          className="scenario-button"
          type="button"
          onClick={() => actions.simulateScenario('mobile')}
        >
          Mobile quick-check
        </button>
        <button
          className="scenario-button"
          type="button"
          onClick={() => actions.clearSimulation()}
        >
          Clear simulation
        </button>
      </div>
    </section>
  );
}

function PlanSummary() {
  const plan = useAdaptivePlan('dashboard.home');
  const why = useAdaptiveWhy('dashboard.home');
  const actions = useAdaptiveActions();

  if (!plan || !why) {
    return null;
  }

  return (
    <section className="topbar-card summary-card">
      <div className="summary-row">
        <div>
          <div className="eyebrow">Current plan</div>
          <strong>{plan.layoutMode}</strong> layout · {plan.disclosureLevel}{' '}
          disclosure · {plan.transitionMode} transition
        </div>
        <div>
          <div className="eyebrow">Confidence</div>
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
        {why.summary.slice(0, 3).map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
      <div className="scenario-row">
        <button
          className="secondary-button"
          type="button"
          onClick={() => actions.simulateScenario('high-contrast')}
        >
          Simulate high contrast
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={() => actions.simulateScenario('reduced-motion')}
        >
          Simulate reduced motion
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={() => actions.resetPreferences()}
        >
          Reset to defaults
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
      <AdaptiveDevtoolsOverlay surfaceId="dashboard.home" />
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
        locale: 'en-US',
        timezone: 'UTC',
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
