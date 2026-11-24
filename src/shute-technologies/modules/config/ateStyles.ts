import { ATEITheme, ATEIThemeValues, ATEDefaultTheme } from './ateTheme';
import { ATEDictionary } from '../common/ateInterfaces';

export class ATEStyles {

  private constructor() { }

  static readonly default_Seconds = 10;
  static readonly default_SubSegments = 10;

  static readonly scrollbarHeight = 16;
  static readonly guiHeight = 240;
  static readonly canvasHeight = ATEStyles.guiHeight - ATEStyles.scrollbarHeight;
  // Theme fields (colours and fonts) are writable: set them with applyTheme(), see ATEIThemeValues.
  static backgroundColor = ATEDefaultTheme.canvas.background;

  // Controls: Styles
  static cStroke_Color = ATEDefaultTheme.canvas.stroke;
  static font_Color = ATEDefaultTheme.canvas.text;
  static readonly ac_Width = 200;
  // Controls: Timeline GUI
  static readonly ac_TimelineHeight = 60;
  static readonly ac_TimelineSegmentWidth = 160;
  static readonly ac_TimelineSubSegmentHeight = 6;
  static readonly ac_TimelineSubSegmentLimitsHeight = 20;
  static ac_TimelineSubSegment_Color = ATEDefaultTheme.canvas.ticks;
  static ac_TimelineSubSegment_TextStyle = ATEDefaultTheme.canvas.textFont;
  // Controls: Layer GUI
  static readonly ac_TimelineLayerHeight = 30;
  static tweenColor = ATEDefaultTheme.canvas.tween;

  static readonly timeline = {
    offsetX: 22,
    offsetY: 1
  };

  // Controls: Playback
  static readonly playback = {
    defaultTime: 1,
    gui_Width: 52,
    gui_Height: 15,
    gui_TextStyle: ATEDefaultTheme.canvas.playhead.textFont,
    gui_TextColor: ATEDefaultTheme.canvas.playhead.text,
    gui_BackgroundColor: ATEDefaultTheme.canvas.playhead.background,
    gui_LineColor: ATEDefaultTheme.canvas.playhead.line,
    gui_TextTimeOffset: {
      x: 2,
      y: -4
    }
  };

  // The HTML panel's theme. The panel reads it through the CSS custom properties of cssVariables().
  static readonly panel: ATEIThemeValues['panel'] = { ...ATEDefaultTheme.panel };

  static readonly scrollbar = {
    horizontalSize: 14,
    verticalSize: 30
  };

  /**
   * Deep-merges `theme` into the styles: fields it leaves out keep their current value. The canvas reads
   * the styles on every frame, so the next frame shows the change. The styles are shared by every ATEEngine
   * on the page; an engine's HTML panel picks the change up on ATEEngine#applyTheme. To switch themes,
   * resetTheme() first, or pass a theme that sets every field. Only theme fields are written.
   */
  static applyTheme(theme: ATEITheme): void {
    const canvas = (theme && theme.canvas) || {};
    const playhead = canvas.playhead || {};
    const panel = ((theme && theme.panel) || {}) as ATEDictionary<string>;
    const pick = (value: string, current: string) => typeof value === 'string' ? value : current;

    ATEStyles.backgroundColor = pick(canvas.background, ATEStyles.backgroundColor);
    ATEStyles.cStroke_Color = pick(canvas.stroke, ATEStyles.cStroke_Color);
    ATEStyles.font_Color = pick(canvas.text, ATEStyles.font_Color);
    ATEStyles.ac_TimelineSubSegment_TextStyle = pick(canvas.textFont, ATEStyles.ac_TimelineSubSegment_TextStyle);
    ATEStyles.ac_TimelineSubSegment_Color = pick(canvas.ticks, ATEStyles.ac_TimelineSubSegment_Color);
    ATEStyles.tweenColor = pick(canvas.tween, ATEStyles.tweenColor);
    ATEStyles.playback.gui_BackgroundColor = pick(playhead.background, ATEStyles.playback.gui_BackgroundColor);
    ATEStyles.playback.gui_LineColor = pick(playhead.line, ATEStyles.playback.gui_LineColor);
    ATEStyles.playback.gui_TextColor = pick(playhead.text, ATEStyles.playback.gui_TextColor);
    ATEStyles.playback.gui_TextStyle = pick(playhead.textFont, ATEStyles.playback.gui_TextStyle);

    // null is a value for the panel fields whose default is null: it hands them back to their fallback.
    const panelStyles = ATEStyles.panel as ATEDictionary<string>;
    const panelDefaults = ATEDefaultTheme.panel as ATEDictionary<string>;

    for (const key of Object.keys(panelDefaults)) {
      const value = panel[key];

      if (typeof value === 'string' || (value === null && panelDefaults[key] === null)) {
        panelStyles[key] = value;
      }
    }
  }

  /** Restores every theme field to ATEDefaultTheme. Geometry is not touched. */
  static resetTheme(): void {
    ATEStyles.applyTheme(ATEDefaultTheme);
  }

  /**
   * The CSS custom properties the HTML panel reads, resolved from the current theme. ATEEngine sets them on
   * its root element. A null value means the property is left unset, so the element keeps its fallback.
   */
  static cssVariables(): ATEDictionary<string> {
    const panel = ATEStyles.panel;

    return {
      '--ate-panel-bg': panel.background || ATEStyles.backgroundColor,
      '--ate-border': panel.border || ATEStyles.cStroke_Color,
      '--ate-label': panel.label,
      '--ate-label-font-family': panel.labelFontFamily || null,
      '--ate-label-font-size': panel.labelFontSize || null,
      '--ate-layer-name': panel.layerName || ATEStyles.ac_TimelineSubSegment_Color,
      '--ate-input': panel.input
    };
  }
}
