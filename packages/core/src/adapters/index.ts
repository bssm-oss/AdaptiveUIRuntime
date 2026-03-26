import type {
  ExperimentAdapter,
  TelemetryAdapter,
  TelemetryEvent
} from '../types';

export class BufferedTelemetryAdapter implements TelemetryAdapter {
  readonly events: TelemetryEvent[] = [];

  emit(event: TelemetryEvent): void {
    this.events.push(event);
  }
}

export class NoopExperimentAdapter implements ExperimentAdapter {
  assign(): string | null {
    return null;
  }
}
