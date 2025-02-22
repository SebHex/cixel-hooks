# cixel-hooks

A growing collection of custom React hooks, built by [Cixel](https://cixel.com.au).

## Installation

<pre>npm install <a href="https://www.npmjs.com/package/cixel-hooks">cixel-hooks</a></pre>

## Usage example

> [!TIP]
> The `useEventListener` hook attaches to `window` or `document` based on the event if `ref` is omitted.

```jsx
import { useEventListener } from 'cixel-hooks'

function Component() {
  useEventListener('resize', onResize)
}
```

## Available hooks

- [useCallbackOnce](https://github.com/SebHex/cixel-hooks/blob/main/src/hooks/use-callback-once.ts)
- [useCopyToClipboard](https://github.com/SebHex/cixel-hooks/blob/main/src/hooks/use-copy-to-clipboard.ts)
- [useDelayedTouchEventListener](https://github.com/SebHex/cixel-hooks/blob/main/src/hooks/use-delayed-touch-event-listener.ts)
- [useEffectOnce](https://github.com/SebHex/cixel-hooks/blob/main/src/hooks/use-effect-once.ts)
- [useEventListener](https://github.com/SebHex/cixel-hooks/blob/main/src/hooks/use-event-listener.ts)
- [useInView](https://github.com/SebHex/cixel-hooks/blob/main/src/hooks/use-in-view.ts)
- [useInterval](https://github.com/SebHex/cixel-hooks/blob/main/src/hooks/use-interval.ts)
- [useMediaQuery](https://github.com/SebHex/cixel-hooks/blob/main/src/hooks/use-media-query.ts)
- [useMergedRef](https://github.com/SebHex/cixel-hooks/blob/main/src/hooks/use-merged-ref.ts)
- [usePrevious](https://github.com/SebHex/cixel-hooks/blob/main/src/hooks/use-previous.ts)
- [useMounted](https://github.com/SebHex/cixel-hooks/blob/main/src/hooks/use-mounted.ts)
- [useScrollPosition](https://github.com/SebHex/cixel-hooks/blob/main/src/hooks/use-scroll-position.ts)
- [useTimeUnitInterval](https://github.com/SebHex/cixel-hooks/blob/main/src/hooks/use-time-unit-interval.ts)
- [useTimeout](https://github.com/SebHex/cixel-hooks/blob/main/src/hooks/use-timeout.ts)
