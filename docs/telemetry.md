# Telemetry

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

Telemetry is important for validating that adaptation is helping users without making the UI unstable.

## What to Measure

At minimum, the runtime should emit:

- exposure events
- override events
- outcome events
- plan resolution latency

## Why Exposure Matters

If a variant is selected but never recorded, teams cannot connect behavior changes to adaptation choices.

## Why Override Matters

Overrides reveal where the runtime guessed wrong or where users want stronger control.

## OTel Bridge

`@adaptive-ui/otel` converts runtime telemetry into OpenTelemetry-compatible signals.

Use it when your host app already has:

- traces
- metrics
- centralized collectors

## 한국어 요약

telemetry는 adaptive UI가 실제로 도움이 되는지 확인하는 핵심 도구입니다.

최소한 아래 이벤트는 기록하는 것이 좋습니다.

- exposure
- override
- outcome
- plan resolution latency

`@adaptive-ui/otel`은 이런 runtime event를 OpenTelemetry 파이프라인으로 연결하는 브리지입니다.
이미 trace와 metrics 수집 체계가 있는 조직에서 특히 유용합니다.
