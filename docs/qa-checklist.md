# QA Checklist

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

Use this checklist before merging adaptive behavior changes.

## Functional

- explicit overrides apply immediately
- explicit overrides persist across reload
- reset to defaults works
- plan explanation remains available
- no critical surface renders an unknown variant

## Accessibility

- no focus loss during allowed adaptations
- keyboard navigation remains stable
- reduced motion is respected
- contrast preference is respected
- critical actions remain visible

## Stability

- weak signals do not cause large changes
- cooldown prevents repeated navigation flips
- low-confidence decisions prefer no-op

## Verification Commands

```bash
./run check
./run usage
./run e2e
```

## 한국어 요약

머지 전에 최소한 아래를 확인해야 합니다.

- manual override 즉시 반영
- persistence 동작
- reset 동작
- why trace 확인 가능
- focus loss 없음
- reduced motion/contrast 준수
- weak signal로 큰 변화가 일어나지 않음
