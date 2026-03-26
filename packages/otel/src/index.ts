import type { TelemetryAdapter, TelemetryEvent } from '@adaptive-ui/core';
import { metrics, trace } from '@opentelemetry/api';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import {
  MeterProvider,
  PeriodicExportingMetricReader
} from '@opentelemetry/sdk-metrics';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';

export interface OpenTelemetryAdapterConfig {
  serviceName?: string;
  traceUrl?: string;
  metricsUrl?: string;
  headers?: Record<string, string>;
  exportIntervalMillis?: number;
}

function flattenPayload(
  payload: Record<string, unknown>
): Record<string, string | number | boolean> {
  return Object.fromEntries(
    Object.entries(payload).flatMap(([key, value]) => {
      if (value === null || value === undefined) {
        return [];
      }

      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        return [[key, value]];
      }

      return [[key, JSON.stringify(value)]];
    })
  );
}

export interface OpenTelemetryAdapter extends TelemetryAdapter {
  shutdown(): Promise<void>;
}

export function createOpenTelemetryAdapter(
  config: OpenTelemetryAdapterConfig = {}
): OpenTelemetryAdapter {
  const tracerProvider = new WebTracerProvider({
    spanProcessors: [
      new SimpleSpanProcessor(
        new OTLPTraceExporter({
          ...(config.traceUrl ? { url: config.traceUrl } : {}),
          ...(config.headers ? { headers: config.headers } : {})
        })
      )
    ]
  });
  tracerProvider.register();
  trace.setGlobalTracerProvider(tracerProvider);

  const meterProvider = new MeterProvider({
    readers: [
      new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          ...(config.metricsUrl ? { url: config.metricsUrl } : {}),
          ...(config.headers ? { headers: config.headers } : {})
        }),
        exportIntervalMillis: config.exportIntervalMillis ?? 15_000
      })
    ]
  });
  metrics.setGlobalMeterProvider(meterProvider);

  const tracer = trace.getTracer(config.serviceName ?? 'adaptive-ui-runtime');
  const meter = meterProvider.getMeter(
    config.serviceName ?? 'adaptive-ui-runtime'
  );
  const counter = meter.createCounter('adaptive_ui_events_total', {
    description: 'Adaptive UI telemetry events emitted through the runtime.'
  });

  return {
    emit(event: TelemetryEvent) {
      const span = tracer.startSpan(`adaptive-ui.${event.type}`);
      const attributes = flattenPayload({
        event_type: event.type,
        surface_id: event.surfaceId ?? 'unknown',
        ...event.payload
      });
      span.setAttributes(attributes);
      span.end();
      counter.add(1, {
        event_type: event.type,
        surface_id: event.surfaceId ?? 'unknown'
      });
    },
    async shutdown() {
      await Promise.all([tracerProvider.shutdown(), meterProvider.shutdown()]);
    }
  };
}
