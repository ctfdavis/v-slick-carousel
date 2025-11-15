# FAQ

## Carousel scales to infinity

> :memo: **TLDR:**
> Give a fixed width to the parent or use `widthDetection: 'manual'`.

The carousel may scale to infinity if the parent element's width is not fixed. This typically happens when the component is used in a flex or grid layout. By default, the carousel's algorithm to determine the carousel's width expects its parent element to stop expanding after a certain width is reached while the track's width is still growing. Such is the case in a block formatting context where the viewport bounds the block-level elements. However, in flex and grid layouts, this may not be the case sometimes.

If you wish to use the carousel in such a scenario but encounter this issue, you can either give a fixed width to the parent element or use the `manual` mode in the [`widthDetection`](/guide/settings#widthdetection) setting.

When `widthDetection` is set to `manual`, the carousel will employ a width detection step to determine the carousel's width. This ensures that the carousel fills its parent element adequately both on mount and after every window resize event. The downside to the `manual` mode is that the transition is not as smooth during window resize events.

See [Flex Layout](/examples/flex-layout) for an example of using the `manual` mode in a flex layout.

## SSR support

> :memo: **TLDR:**
> The carousel is SSR‑compatible. It renders a stable, breakpoint‑agnostic layout on the server and during initial hydration, then applies responsive settings on the client after mount.

When used in SSR frameworks (such as Nuxt), the carousel renders with its base `settings` on the server and on the client's initial render. It does **not** rely on runtime viewport information during hydration. This keeps the HTML structure the same between server and client and avoids hydration mismatches.

After the component has mounted on the client, the responsive configuration ([`responsive`](/guide/settings#responsive) prop) is applied based on the current viewport. At this point, the number of visible slides or clones may change, which can cause a small layout adjustment, but this happens as a normal client‑side update and is safe.



