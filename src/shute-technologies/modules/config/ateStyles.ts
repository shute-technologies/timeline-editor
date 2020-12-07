export class ATEStyles {

  private constructor() { }

  static readonly default_Seconds = 10;
  static readonly default_SubSegments = 10;

  static readonly scrollbarHeight = 16;
  static readonly guiHeight = 240;
  static readonly canvasHeight = ATEStyles.guiHeight - ATEStyles.scrollbarHeight;
  static readonly backgroundColor = '#4e4e4e';

  // Controls: Styles
  static readonly cStroke_Color = '#6e6e6e';
  static readonly font_Color = '#f9f9f9';
  static readonly ac_Width = 200;
  // Controls: Timeline GUI
  static readonly ac_TimelineHeight = 60;
  static readonly ac_TimelineSegmentWidth = 160;
  static readonly ac_TimelineSubSegmentHeight = 6;
  static readonly ac_TimelineSubSegmentLimitsHeight = 20;
  static readonly ac_TimelineSubSegment_Color = '#f9f9f9';
  static readonly ac_TimelineSubSegment_TextStyle = 'bold 9px Arial';
  // Controls: Layer GUI
  static readonly ac_TimelineLayerHeight = 30;

  static readonly timeline = {
    offsetX: 22,
    offsetY: 1
  };

  // Controls: Playback
  static readonly playback = {
    defaultTime: 1,
    gui_Width: 52,
    gui_Height: 15,
    gui_TextStyle: 'bold 12px Arial',
    gui_TextColor: 'white',
    gui_BackgroundColor: 'red',
    gui_LineColor: '#FF000066',
    gui_TextTimeOffset: {
      x: 2,
      y: -4
    }
  };

  static readonly scrollbar = {
    horizontalSize: 14,
    verticalSize: 30
  };
}
