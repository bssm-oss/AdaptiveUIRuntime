import {
  AdaptiveDevtoolsPanel,
  type AdaptiveDevtoolsPanelProps
} from './panel';

export function AdaptiveDevtoolsOverlay(props: AdaptiveDevtoolsPanelProps) {
  return (
    <div
      style={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        zIndex: 1000
      }}
    >
      <AdaptiveDevtoolsPanel {...props} />
    </div>
  );
}
