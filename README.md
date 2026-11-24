![Publish to NPM](https://github.com/shute-technologies/timeline-editor/workflows/Publish%20to%20NPM/badge.svg) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) ![npm](https://img.shields.io/npm/v/shute-technologies.timeline-editor) ![GitHub last commit](https://img.shields.io/github/last-commit/shute-technologies/timeline-editor) ![npm](https://img.shields.io/npm/dt/shute-technologies.timeline-editor) ![npm bundle size](https://img.shields.io/bundlephobia/min/shute-technologies.timeline-editor)

A Flash type generic animation editor module por easier creations of animations in web canvas.

The runtime implements an interface ('GEEIPlaybackObject') from another library in: https://github.com/shute-technologies/graph-editor, and is for integration purpose and as a default for an existing IDE that use both libraries to create animation graphs, that implementation can be easily removed and is not tighly coupled with this library.

## Theming

Every colour and font the timeline draws with can be set through a theme, and the transport buttons can
show your own icons:

```ts
import { ATEEngine, ATEStyles, ATEITheme, ATEIThemeValues, ATEDefaultTheme, ATEITransportIcons } from 'shute-technologies.timeline-editor';

const engine = new ATEEngine('#timeline', { theme, icons }); // both optional, next to externalResourcePath

engine.applyTheme(theme); // deep merge into ATEStyles, then refresh this engine's CSS variables
engine.resetTheme();      // every field back to ATEDefaultTheme

ATEStyles.applyTheme(theme); // the shared styles only: the canvas shows it, the HTML on engine.applyTheme()
ATEStyles.resetTheme();
```

- `ATEITheme` is any subset of the fields below, at any depth. `ATEIThemeValues` is the complete set.
- `ATEDefaultTheme` is the look the timeline has always had (frozen). Without a theme nothing changes.
- Fields a theme leaves out keep their current value. To switch themes, call `resetTheme()` first, or apply
  a theme that sets every field you use, so that nothing from the previous theme stays behind.
- Only colours and fonts are themable. Geometry (sizes, offsets, line widths) and unknown keys are ignored.
- `ATEStyles` is shared by every `ATEEngine` on the page. The canvas reads it on every frame, so the next
  frame shows a change. Each engine's HTML reads CSS variables on its root element, which
  `engine.applyTheme()` rewrites; `engine.applyTheme()` with no theme just refreshes them.
- Colours are any CSS colour. Fields named `...Font` are CSS `font` shorthands, e.g. `'bold 9px Arial'`.

### Fields

| Field | What it colours | Default |
| --- | --- | --- |
| `canvas.background` | Canvas background | `'#4e4e4e'` |
| `canvas.stroke` | Separator lines, layer lines, grid lines between whole seconds | `'#6e6e6e'` |
| `canvas.text` | Time labels above the ruler | `'#f9f9f9'` |
| `canvas.textFont` | Font of the time labels | `'bold 9px Arial'` |
| `canvas.ticks` | Ruler ticks and the grid lines on whole seconds | `'#f9f9f9'` |
| `canvas.tween` | The band between two keyframes joined by a tween | `'#0000FF55'` |
| `canvas.playhead.background` | The box behind the current time | `'red'` |
| `canvas.playhead.line` | The playhead's vertical line | `'#FF000066'` |
| `canvas.playhead.text` | The current time | `'white'` |
| `canvas.playhead.textFont` | Font of the current time | `'bold 12px Arial'` |
| `panel.background` | The HTML panel left of the canvas | `null`: `canvas.background` |
| `panel.border` | The separators under the controls and under each layer | `null`: `canvas.stroke` |
| `panel.label` | The `Time:` and `/` labels, and markup icons (they inherit it) | `'white'` |
| `panel.labelFontFamily` | Font family of the labels and layer names | `null`: labels inherit the page's font, layer names use Arial |
| `panel.labelFontSize` | Font size of the labels | `null`: `Time:` is 12px, `/` inherits |
| `panel.layerName` | Layer names | `null`: `canvas.ticks` |
| `panel.input` | Text and dotted underline of the two time inputs | `'rgb(184, 184, 184)'` |

A panel field set to `null` goes back to its fallback (`label` and `input` have none and ignore `null`).
The canvas fields are also the `ATEStyles` statics the canvas reads (`backgroundColor`, `cStroke_Color`,
`font_Color`, `ac_TimelineSubSegment_TextStyle`, `ac_TimelineSubSegment_Color`, `tweenColor`, `playback.gui_*`);
the panel fields are `ATEStyles.panel`. Set them with `applyTheme` rather than by assignment.

### CSS variables

The panel takes its colours from CSS custom properties that the engine sets inline on its root element (the
element its selector names, which also gets the class `ate-root`). No colour is written inline anywhere
else, so a theme change applies at once. To override one from a stylesheet, set it on `.ate-panel`, which is
inside the root and so wins over the root's inline value:

| Variable | Theme field |
| --- | --- |
| `--ate-panel-bg` | `panel.background` |
| `--ate-border` | `panel.border` |
| `--ate-label` | `panel.label` |
| `--ate-label-font-family` | `panel.labelFontFamily` (unset by default) |
| `--ate-label-font-size` | `panel.labelFontSize` (unset by default) |
| `--ate-layer-name` | `panel.layerName` |
| `--ate-input` | `panel.input` |

`ATEStyles.cssVariables()` returns the current values.

### Transport buttons and icons

The transport is three `<button type="button">` elements:

| Button | Classes | `aria-label` | `aria-pressed` |
| --- | --- | --- | --- |
| Record | `ate-button ate-button-record` | `Record`, toggled `Stop recording` | yes |
| Play | `ate-button ate-button-play` | `Play`, toggled `Pause` | yes |
| Stop | `ate-button ate-button-stop` | `Stop` | no |

While toggled, a button also has the class `is-toggled`. By default each shows the same 20px image as
before; the button around it has no border, background or padding. That reset is one `.ate-button` rule
inserted first in `<head>`, so any rule of yours for `.ate-button`, or anything more specific, overrides it
without `!important`.

`icons` replaces any of the five states (`record`, `stopRecording`, `play`, `pause`, `stop`). A value starting
with `<` is markup, inserted as HTML (so pass only markup you trust); anything else is an image URL, used as
given. States left out keep their image.

`ATEHTMLButton` builds these and stays compatible: `initialize(state1, state2?, options?)` takes markup or
an image URL for each state; `options` adds `className`, `label`, `toggledLabel` and `toggle` (aria-pressed
and `is-toggled`). `buttonSelector`, `callbackClick`, `callbackCanClick`, `reset()` and `addMargin()` work as
before.

### Example: the Graphite palette

```ts
import { ATEEngine, ATEITheme, ATEITransportIcons } from 'shute-technologies.timeline-editor';

interface Palette {
  bgSurface: string; bgSurface2: string; bgInput: string; border: string; borderStrong: string;
  text: string; textMuted: string; accent: string; onAccent: string;
}

const graphite: Record<'dark' | 'light', Palette> = {
  dark: {
    bgSurface: '#15181e', bgSurface2: '#1b1f27', bgInput: '#101319', border: '#2a303c', borderStrong: '#3a4252',
    text: '#e6e9ef', textMuted: '#9aa2b2', accent: '#5b8cff', onAccent: '#0b0d12'
  },
  light: {
    bgSurface: '#f5f6f8', bgSurface2: '#eceef2', bgInput: '#ffffff', border: '#d1d6de', borderStrong: '#b4bbc7',
    text: '#1b1f27', textMuted: '#515969', accent: '#2f5ccd', onAccent: '#ffffff'
  }
};

const fontFamily = '"Inter Variable", Inter, system-ui, sans-serif';
const font = `600 10px ${fontFamily}`;

function toTimelineTheme(p: Palette): ATEITheme {
  return {
    canvas: {
      background: p.bgSurface,
      stroke: p.border,
      text: p.textMuted,
      textFont: font,
      ticks: p.borderStrong,
      tween: `${p.accent}33`, // the accent at 20%
      playhead: { background: p.accent, line: p.accent, text: p.onAccent, textFont: font }
    },
    panel: {
      background: p.bgSurface,
      border: p.border,
      label: p.textMuted,
      labelFontFamily: fontFamily,
      layerName: p.text,
      input: p.text
    }
  };
}

const icons: ATEITransportIcons = {
  record: '<i class="we-i we-i-record" aria-hidden="true"></i>',
  stopRecording: '<i class="we-i we-i-stop" aria-hidden="true"></i>',
  play: '<i class="we-i we-i-play" aria-hidden="true"></i>',
  pause: '<i class="we-i we-i-pause" aria-hidden="true"></i>',
  stop: '<i class="we-i we-i-stop" aria-hidden="true"></i>'
};

const engine = new ATEEngine('#timeline', { theme: toTimelineTheme(graphite.dark), icons });

// On every theme change. The theme sets the same fields in both modes, so nothing of the old one stays.
function setTimelineTheme(mode: 'dark' | 'light'): void {
  engine.applyTheme(toTimelineTheme(graphite[mode]));
}
```

Markup icons inherit the button's colour, which is `--ate-label` unless you style it:

```css
.ate-button { width: 22px; height: 22px; border-radius: 4px; }
.ate-button:hover { color: var(--we-text); }
.ate-button-record { color: var(--we-danger); }
```

### Upgrading from 0.13

- The transport images are now inside `<button>` elements. Selectors such as `img[src$='spPlay.png']` still
  match the image, but `.ate-button-play.is-toggled` and the `icons` option replace them.
- The labels no longer have an inline `color:white`, and the panel no longer has an inline background colour:
  theme them, or set the CSS variables, instead of overriding with `!important`.
- The colour and font statics of `ATEStyles` are writable; use `ATEStyles.applyTheme` instead of casting.
