/**
 * Every colour and font the timeline draws with. Colours are any CSS colour; fields named `...Font` are
 * CSS `font` shorthands ('bold 9px Arial'). Geometry (sizes, offsets, line widths) is not part of a theme.
 */
export interface ATEIThemeValues {
  /** The canvas: ruler, grid, layer lines and playhead. Read on every frame. */
  canvas: {
    /** Canvas background. */
    background: string;
    /** Separator lines, layer lines and the grid lines between whole seconds. */
    stroke: string;
    /** Time labels above the ruler. */
    text: string;
    /** Font of the time labels above the ruler. */
    textFont: string;
    /** Ruler ticks and the grid lines on whole seconds. */
    ticks: string;
    /** The band between two keyframes joined by a tween. */
    tween: string;
    /** The box showing the current time and the line under it. */
    playhead: {
      /** The box behind the current time. */
      background: string;
      /** The vertical line through the layers. */
      line: string;
      /** The current time. */
      text: string;
      /** Font of the current time. */
      textFont: string;
    };
  };
  /**
   * The HTML panel left of the canvas (transport, time inputs, layer names). It reads these through CSS
   * custom properties on the engine's root element, so a change applies at once.
   */
  panel: {
    /** Panel background (`--ate-panel-bg`). null: the canvas background. */
    background: string | null;
    /** Separators under the controls and under each layer (`--ate-border`). null: the canvas stroke. */
    border: string | null;
    /** The 'Time:' and '/' labels, and the colour markup icons inherit (`--ate-label`). */
    label: string;
    /**
     * Font family of the labels and layer names (`--ate-label-font-family`). null: the labels inherit
     * the page's font and the layer names use Arial.
     */
    labelFontFamily: string | null;
    /** Font size of the labels (`--ate-label-font-size`). null: 'Time:' is 12px, '/' inherits. */
    labelFontSize: string | null;
    /** Layer names (`--ate-layer-name`). null: the canvas ticks colour. */
    layerName: string | null;
    /** Text and dotted underline of the two time inputs (`--ate-input`). */
    input: string;
  };
}

export type ATEDeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? ATEDeepPartial<T[K]> : T[K];
};

/** What ATEStyles.applyTheme and ATEEngine#applyTheme take: any subset of the theme values. */
export type ATEITheme = ATEDeepPartial<ATEIThemeValues>;

/** The look the timeline has always had. ATEStyles.resetTheme() restores it. */
export const ATEDefaultTheme: ATEIThemeValues = Object.freeze({
  canvas: Object.freeze({
    background: '#4e4e4e',
    stroke: '#6e6e6e',
    text: '#f9f9f9',
    textFont: 'bold 9px Arial',
    ticks: '#f9f9f9',
    tween: '#0000FF55',
    playhead: Object.freeze({
      background: 'red',
      line: '#FF000066',
      text: 'white',
      textFont: 'bold 12px Arial'
    })
  }),
  panel: Object.freeze({
    background: null,
    border: null,
    label: 'white',
    labelFontFamily: null,
    labelFontSize: null,
    layerName: null,
    input: 'rgb(184, 184, 184)'
  })
});
