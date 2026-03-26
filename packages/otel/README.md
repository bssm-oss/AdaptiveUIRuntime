# @adaptive-ui/otel

OpenTelemetry bridge for adaptive UI runtime telemetry.

> English first, Korean summary below.
> 영어 설명이 먼저 나오고 아래에 한국어 요약이 이어집니다.

## What it provides

- telemetry adapter for OpenTelemetry pipelines
- OTLP-friendly export path
- runtime event bridging

## Typical usage

Install:

```bash
pnpm add @adaptive-ui/otel
```

Use the package when you want to connect adaptive runtime telemetry to an OpenTelemetry pipeline.

## Package role

`@adaptive-ui/otel` is optional.
The core runtime stays vendor-neutral, and this package provides the bridge into an OTLP-based observability stack.

## 한국어 요약

`@adaptive-ui/otel`은 adaptive runtime telemetry를 OpenTelemetry 파이프라인에 연결하는 브리지입니다.
